'use client'
import React, { useEffect, useState ,useRef} from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
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
import {
  getUserInfoAction,
  getAllCoursesAction,
  addCompletedLessonAction,
  addCompletedLessonReducer,
  addProgressAction,
  
} from "@/store/slices/authSlice";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";

import TopMenu from "@/components/topmenu";
import { logoutAction } from "@/store/slices/authSlice";
const VideoPlayer = ({ material }) => {
  if (!material || !material.file_path) {
    return <div>Видео недоступно.</div>;
  }

  return (
    <Box>
      <Typography variant="h6">{material.title}</Typography>
      <video controls width="100%">
        <source src={material.file_path} type="video/mp4" />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    </Box>
  );
};
export default function CourseDetail() {
  const { id } = useParams(); // Получаем ID курса из URL
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progresses, setProgresses] = useState([]);
  const token = localStorage.getItem("token");

  const router = useRouter();
 
  const editorInstance = useRef(null); // Ссылка на экземпляр Editor.js
  const { courses, loadingCourses, coursesError } = useSelector((state) => state.auth);
  const userData = useSelector((state) => state.auth.currentUser);
  const completedLessonsFromSlice = useSelector((state) => state.auth.completedLessons);
  
  const [allProgresses,setAllProgresses]= useState([]);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  
  const [userInfo, setUserInfo] = useState(null); // Инициализируем как null
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [course,setCourse]=useState(null)
 const isAuth = useSelector((state) => state.auth.isAuth);

  // Фильтрация уроков по courseId
  const filteredLessons = lessons.filter((lesson) => lesson.course_id === Number(id));
  
  // Фильтрация материалов по lesson_id
  const filteredMaterials = materials.filter(
    (material) => material.lesson_id === filteredLessons[activeTab]?.id
  );

  // Функция для проверки статуса урока
  const isLessonCompleted = (lessonId) => {
    const progress = progresses.find((p) => p.lesson_id === lessonId);
    return progress?.status === "completed";
  };

  // Загрузка уроков
  const fetchLessons = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/lessons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
    }
  };

  // Загрузка материалов
  const fetchMaterials = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/materials");
      setMaterials(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке материалов:", error);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Получение всех записей о прогрессе пользователя
  const fetchAllProgresses = async (userId, course) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/course/progress/${userId}/${course}`);
      const data = response.data.lessons; // Предполагаем, что сервер возвращает { lessons: [...] }

      if (Array.isArray(data)) {
        setProgresses(data); // Сохраняем массив в состояние
      } else {
        console.error("Данные о прогрессе не являются массивом:", data);
      }
    } catch (error) {
      console.error("Ошибка при получении прогресса:", error);
    }
  };

  useEffect(() => {
    const decoded = jwtDecode(token);
    fetchLessons();
    fetchMaterials();
    fetchAllProgresses(decoded.id, id);
    fetchUserInfo()

    

  }, [id]);
  
  const [isEditorInitialized, setIsEditorInitialized] = useState(false);


  // useEffect(() => {
  //   if (filteredLessons[activeTab] && filteredLessons[activeTab].content && !isEditorInitialized) {
 
  //     try {
  //       const content = JSON.parse(filteredLessons[activeTab].content);
  //       console.log("Parsed content:", content);
  
  //       // Уничтожаем предыдущий экземпляр Editor.js
  //       if (editorInstance.current) {
  //         try {
  //           editorInstance.current.destroy();
  //         } catch (error) {
  //           console.warn("Ошибка при уничтожении предыдущего экземпляра Editor.js:", error);
  //         }
  //         editorInstance.current = null;
  //       }
  //       // Создаем новый экземпляр Editor.js
  //       const editor = new EditorJS({
  //         holder: "editorjs-container",
  //         readOnly: true,
  //         data: content,
  //         tools: {
  //           header: Header,
  //           list: List,
  //           paragraph: Paragraph,
  //         },
  //       });
  //       if (editorInstance.current) {
  //                 try {
  //                   editorInstance.current.destroy(); // Ensure this is a valid EditorJS instance
  //                 } catch (error) {
  //                   console.warn("Ошибка при уничтожении предыдущего экземпляра Editor.js:", error);
  //                 }
  //                 editorInstance.current = null;
  //               }
  
  //       editorInstance.current = editor;
  //       setIsEditorInitialized(true);
  //     } catch (error) {
  //       console.error("Ошибка при парсинге содержимого урока:", error);
  //     }
  //   }
  //   return () => {

  //     // Очистка экземпляра Editor.js при размонтировании
  //     if (editorInstance.current) {
  //       try {
  //         editorInstance.current.destroy();
  //       } catch (error) {
  //         console.warn("Ошибка при уничтожении экземпляра Editor.js:", error);
  //       }
  //       editorInstance.current = null;
  //     }
  //     // setIsEditorInitialized(false);
  //   };
  
  
  // }, [activeTab, filteredLessons]);

  useEffect(() => {
    if (filteredLessons[activeTab] && filteredLessons[activeTab].content) {
      console.log('FilteredLEssons= ',filteredLessons)
      try {
        const content = JSON.parse(filteredLessons[activeTab].content);
  
        if (!content || typeof content !== "object" || !Array.isArray(content.blocks)) {
          throw new Error("Некорректный формат данных для Editor.js");
        }
  
        // Уничтожаем предыдущий экземпляр
        if (editorInstance.current) {
          try {
            editorInstance.current.destroy();
          } catch (error) {
            console.warn("Ошибка при уничтожении предыдущего экземпляра Editor.js:", error);
          }
          editorInstance.current = null;
        }
  
        // Очищаем контейнер
        const container = document.getElementById("editorjs-container");
        if (container) {
          container.innerHTML = "";
        }
  
        // Создаем новый экземпляр
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
      // Очистка экземпляра Editor.js при размонтировании
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




  const fetchUserInfo = async () => {
    // console.log('fetchUserInfo started!')
    try {
      const response = await axios.get("http://localhost:4000/api/auth/getAuthentificatedUserInfo",
      {headers: {
        'Authorization': `Bearer ${token}`,
      }
      },);
      setUserInfo(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
      
    }
  };
  
  const handleCompleteLesson = async (lessonId,courses) => {
    const decoded = jwtDecode(token);

    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }



    try {
      await axios.put("http://localhost:4000/api/progress/update", {
        user_id: decoded.id,
        lesson_id: lessonId,
        progress_percentage: 100,
      });

      const updatedProgresses = progresses.map((p) =>
        p.lesson_id === lessonId ? { ...p, status: "completed" } : p
      );
      setProgresses(updatedProgresses);
    } catch (error) {
      console.error("Ошибка при завершении урока:", error);
    }

    alert('Урок завершен ')
    console.log(',course,courses',courses)
    
    window.location.href = `/courses/${id}`; 
  };

  if (!filteredLessons || filteredLessons.length === 0) {
    return <div>Нет доступных уроков.</div>;
  }

  
  const videoMaterials = filteredMaterials.filter((material) => material.type === "video");

  const getCompletedLessonsCount = () => {
    return progresses.filter((p) => p.status === "completed").length;
  };

  return (
    <>
      <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
      <Box sx={{ display: "flex", flexGrow: 1, bgcolor: "background.paper", minHeight: "100vh", padding: 2 }}>
        {/* Вкладки */}
        <Tabs
          orientation={isMobile ? "horizontal" : "vertical"}
          variant="scrollable"
          value={activeTab}
          onChange={handleChangeTab}
          aria-label="Уроки курса"
          sx={{
            borderRight: isMobile ? 0 : 1,
            borderColor: "divider",
            width: isMobile ? "100%" : "250px",
            backgroundColor: "background.default",
            position: "sticky",
            top: 0,
            overflowY: "auto",
          }}
        >
          {filteredLessons.map((lesson, index) => (
            <Tab
              key={lesson.id}
              label={lesson.title}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "primary.main",
                },
              }}
            />
          ))}
        </Tabs>
  
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <LinearProgress
              variant="determinate"
              value={(getCompletedLessonsCount() / filteredLessons.length) * 100 || 0}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle1">
              Пройдено {getCompletedLessonsCount()} из {filteredLessons.length} уроков
            </Typography>
  
            <Typography variant="h6" sx={{ fontWeight: "bold", my: 2 }}>
              {filteredLessons[activeTab].title}
            </Typography>
  
            {filteredLessons[activeTab].image && (
              <Box
                component="img"
                src={filteredLessons[activeTab].image}
                alt={`Lesson ${activeTab + 1}`}
                sx={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px", mb: 4 }}
              />
            )}
  
            <Box id="editorjs-container" sx={{ mt: 2, minHeight: "50px" }} />
            <hr />
  
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Видео-материалы:
            </Typography>
            {videoMaterials.length > 0 ? (
              videoMaterials.map((material) => (
                <Box key={material.material_id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">{material.title}</Typography>
                  <VideoPlayer material={material} />
                </Box>
              ))
            ) : (
              <Typography variant="body1">Нет доступных видео.</Typography>
            )}
  
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 4, mb: 2 }}>
              Дополнительные материалы:
            </Typography>
            {filteredMaterials.length > 0 ? (
              <MuiList>
                {filteredMaterials.map((material) => (
                  <ListItem key={material.material_id}>
                    <ListItemText primary={material.title} secondary={`Тип: ${material.type}`} />
                    {material.type === "test" ? (
                      <a
                        href={material.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <Button variant="outlined" color="primary">
                          Перейти к тесту
                        </Button>
                      </a>
                    ) : (
                      <Button href={material.file_path} download={material.title || "file"} variant="outlined" color="primary">
                        Скачать
                      </Button>
                    )}
                  </ListItem>
                ))}
              </MuiList>
            ) : (
              <Typography variant="body1">Нет доступных материалов.</Typography>
            )}
          </Paper>
  
          <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              color={isLessonCompleted(filteredLessons[activeTab]?.id) ? "success" : "primary"}
              onClick={() => handleCompleteLesson(filteredLessons[activeTab]?.id, courses)}
              disabled={isLessonCompleted(filteredLessons[activeTab]?.id)}
              sx={{ flexGrow: 1, borderRadius: 2, textTransform: "none", fontWeight: "bold", padding: "10px 20px" }}
            >
              {isLessonCompleted(filteredLessons[activeTab]?.id) ? "Урок завершен" : "Завершить урок"}
            </Button>
            {/* <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push("/courses")}
              sx={{ flexGrow: 1, borderRadius: 2, textTransform: "none", fontWeight: "bold", padding: "10px 20px" }}
            >
              Назад к курсам
            </Button> */}
          </Box>
        </Box>
      </Box>
    </>
  );



}
       