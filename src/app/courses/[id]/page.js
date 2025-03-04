"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
  Typography,
  List as MuiList,
  ListItem,
  ListItemText,
  LinearProgress,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getAllCoursesAction, logoutAction } from "@/store/slices/authSlice";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import TopMenu from "@/components/topmenu";

const VideoPlayer = ({ material }) => {
  if (!material || !material.file_path) {
    return <Typography>Видео недоступно.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
        {material.title}
      </Typography>
      <video controls style={{ width: "50%", maxHeight: "335px" }}>
        <source src={material.file_path} type="video/mp4" />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    </Box>
  );
};

export default function CourseDetail() {
  const host=process.env.NEXT_PUBLIC_HOST
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progresses, setProgresses] = useState([]);
  const [token, setToken] = useState(null);
  const editorInstance = useRef(null);
  const { courses } = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);
  const isMobile = useMediaQuery("(max-width: 600px)");

  // Получение токена на стороне клиента
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) {
      router.push("/login");
    }
  }, [router]);

  // Загрузка данных
  useEffect(() => {
    if (token) {
      fetchLessons();
      fetchMaterials();
      fetchUserInfo();
      dispatch(getAllCoursesAction());
    }
  }, [token, dispatch]);

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${host}/api/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${host}/api/materials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(response.data);
    } catch (error) {
      console.error(`Ошибка при загрузке материалов:`, error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке информации о пользователе:", err);
      if (err.response && err.response.status === 401) {
        router.push("/login");
      }
    }
  };

  const fetchAllProgresses = async (userId, courseId) => {
    try {
      const response = await axios.get(`${host}/api/course/progress/${userId}/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgresses(response.data.lessons || []);
    } catch (error) {
      console.error("Ошибка при получении прогресса:", error);
    }
  };

  useEffect(() => {
    if (userInfo && token) {
      fetchAllProgresses(userInfo.id, id);
    }
  }, [userInfo, id, token]);
  const filteredLessons = lessons.filter((lesson) => lesson.course_id === Number(id));
  useEffect(() => {
    if (filteredLessons[activeTab] && filteredLessons[activeTab].content) {
      try {
        const content = JSON.parse(filteredLessons[activeTab].content);

        if (!content || typeof content !== "object" || !Array.isArray(content.blocks)) {
          throw new Error("Некорректный формат данных для Editor.js");
        }

        if (editorInstance.current) {
          editorInstance.current.destroy();
          editorInstance.current = null;
        }

        const container = document.getElementById("editorjs-container");
        if (container) container.innerHTML = "";

        const editor = new EditorJS({
          holder: "editorjs-container",
          readOnly: true,
          data: content,
          tools: {
            header: Header,
            list: List,
            paragraph: Paragraph,
          },
        });

        editorInstance.current = editor;
      } catch (error) {
        console.error("Ошибка при парсинге содержимого урока:", error);
      }
    }

    return () => {
      if (editorInstance.current) {
        try {
          editorInstance.current.destroy();
        } catch (error) {
          console.warn("Ошибка при уничтожении экземпляра Editor.js:", error);
        }
        editorInstance.current = null;
      }
    };
  }, [activeTab, filteredLessons]);

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const isLessonCompleted = (lessonId) => {
    const progress = progresses.find((p) => p.lesson_id === lessonId);
    return progress?.status === "completed";
  };

  const handleCompleteLesson = async (lessonId) => {
    const decoded = jwtDecode(token);
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }

    try {
      await axios.put(
        `${host}/api/progress/update`,
        {
          user_id: decoded.id,
          lesson_id: lessonId,
          progress_percentage: 100,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedProgresses = progresses.map((p) =>
        p.lesson_id === lessonId ? { ...p, status: "completed" } : p
      );
      setProgresses(updatedProgresses);
      alert("Урок завершен");
      router.push(`/courses/${id}`);
    } catch (error) {
      console.error("Ошибка при завершении урока:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!token) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  
  const filteredMaterials = materials.filter(
    (material) => material.lesson_id === filteredLessons[activeTab]?.id
  );
  const videoMaterials = filteredMaterials.filter((material) => material.type === "video");

  const getCompletedLessonsCount = () => {
    return progresses.filter((p) => p.status === "completed").length;
  };

  if (!filteredLessons || filteredLessons.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6">Нет доступных уроков.</Typography>
      </Box>
    );
  }

  return (
    <>
      <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          minHeight: "calc(100vh - 64px)",
          bgcolor: "background.paper",
          p: { xs: 1, sm: 2 },
        }}
      >
        {/* Вкладки */}
        <Tabs
          orientation={isMobile ? "horizontal" : "vertical"}
          variant="scrollable"
          value={activeTab}
          onChange={handleChangeTab}
          aria-label="Уроки курса"
          sx={{
            borderBottom: isMobile ? 1 : 0,
            borderRight: isMobile ? 0 : 1,
            borderColor: "divider",
            width: { xs: "100%", sm: "250px" },
            bgcolor: "background.default",
            maxHeight: { xs: "auto", sm: "calc(100vh - 64px)" },
            overflowY: "auto",
            flexShrink: 0,
          }}
        >
          {filteredLessons.map((lesson, index) => (
            <Tab
              key={lesson.id}
              label={lesson.title}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                color: "text.secondary",
                "&.Mui-selected": { color: "primary.main" },
                minHeight: { xs: 48, sm: 56 },
                px: { xs: 1, sm: 2 },
              }}
            />
          ))}
        </Tabs>

        {/* Контент */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: { xs: "90%", sm: "auto" },
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: 2,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <LinearProgress
              variant="determinate"
              value={(getCompletedLessonsCount() / filteredLessons.length) * 100 || 0}
              sx={{ mb: 2 }}
            />
            <Typography
              variant="subtitle1"
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              Пройдено {getCompletedLessonsCount()} из {filteredLessons.length} уроков
            </Typography>

            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", my: 2, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
            >
              {filteredLessons[activeTab].title}
            </Typography>

            {filteredLessons[activeTab].image && (
              <Box
                component="img"
                src={filteredLessons[activeTab].image}
                alt={`Lesson ${activeTab + 1}`}
                sx={{
                  width: "100%",
                  height: { xs: "200px", sm: "300px" },
                  objectFit: "cover",
                  borderRadius: "8px",
                  mb: 2,
                }}
              />
            )}

            <Box id="editorjs-container" sx={{ mt: 2, minHeight: "50px", fontSize: { xs: "0.875rem", sm: "1rem" } }} />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
              Видео-материалы:
            </Typography>
            {videoMaterials.length > 0 ? (
              videoMaterials.map((material) => (
                <Box key={material.material_id} sx={{ mb: 2 }}>
                  <VideoPlayer material={material} />
                </Box>
              ))
            ) : (
              <Typography variant="body1" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                Нет доступных видео.
              </Typography>
            )}

            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 4, mb: 2, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
              Дополнительные материалы:
            </Typography>
            {filteredMaterials.length > 0 ? (
              <MuiList>
                {filteredMaterials.map((material) => (
                  <ListItem
                    key={material.material_id}
                    sx={{ flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" } }}
                  >
                    <ListItemText
                      primary={material.title}
                      secondary={`Тип: ${material.type}`}
                      primaryTypographyProps={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                      secondaryTypographyProps={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    />
                    {material.type === "test" ? (
                      <a
                        href={material.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", marginTop: { xs: 1, sm: 0 } }}
                      >
                        <Button variant="outlined" color="primary" size="small">
                          Перейти к тесту
                        </Button>
                      </a>
                    ) : (
                      <Button
                        href={material.file_path}
                        download={material.title || "file"}
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ mt: { xs: 1, sm: 0 } }}
                      >
                        Скачать
                      </Button>
                    )}
                  </ListItem>
                ))}
              </MuiList>
            ) : (
              <Typography variant="body1" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                Нет доступных материалов.
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                variant="contained"
                color={isLessonCompleted(filteredLessons[activeTab]?.id) ? "success" : "primary"}
                onClick={() => handleCompleteLesson(filteredLessons[activeTab]?.id)}
                disabled={isLessonCompleted(filteredLessons[activeTab]?.id)}
                sx={{
                  flexGrow: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                {isLessonCompleted(filteredLessons[activeTab]?.id) ? "Урок завершен" : "Завершить урок"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}