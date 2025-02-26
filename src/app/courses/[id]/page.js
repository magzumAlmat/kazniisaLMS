"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Next.js 13+
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
  Typography,
  styled,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  LinearProgress,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { getCourseByIdAction } from "@/store/slices/authSlice";
import Tiptap, { TextEditor } from "@/components/textEditor"; // Импортируем компонент редактора

// Компонент универсальной кнопки скачивания
const DownloadButton = ({ href, fileName }) => {
  return (
    <Button
      href={href}
      download={fileName || "file"}
      variant="contained"
      color="primary"
      sx={{
        mt: 2,
        textTransform: "none",
        fontWeight: "bold",
        borderRadius: "8px",
      }}
    >
      Скачать
    </Button>
  );
};

// Компонент плеера видео
const VideoPlayer = ({ material }) => {
  if (!material || !material.file_path) {
    return <Typography variant="body1">Видео недоступно.</Typography>;
  }
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        {material.title}
      </Typography>
      <video controls width="100%" height="auto" style={{ borderRadius: "8px" }}>
        <source src={material.file_path} type="video/mp4" />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
      {/* Кнопка для скачивания видео */}
      <DownloadButton href={material.file_path} fileName={material.title || "video.mp4"} />
    </Box>
  );
};

// Индикатор прогресса
const ProgressIndicator = ({ completed, total }) => {
  const progress = (completed / total) * 100;
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="subtitle1">
        Прогресс: {completed} из {total} уроков
      </Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};

export default function CourseDetail() {
  const { id } = useParams(); // Получаем id из URL
  const router = useRouter();
  const dispatch = useDispatch();
  const thisCourse = useSelector((state) => state.auth.currentCourse);
  const loading = useSelector((state) => state.auth.loadingCourse);
  const error = useSelector((state) => state.auth.courseError);

  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [lessonContent, setLessonContent] = useState(""); // Состояние для содержимого урока

  const isMobile = useMediaQuery("(max-width: 600px)");

  // Загрузка уроков
  const fetchLessons = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/lessons");
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

  // Фильтрация уроков по courseId
  const filteredLessons = lessons.filter((lesson) => lesson.course_id === Number(id));

  // Фильтрация материалов по lesson_id
  const filteredMaterials = materials.filter(
    (material) => material.lesson_id === filteredLessons[activeTab]?.id
  );

  useEffect(() => {
    if (id) {
      dispatch(getCourseByIdAction(id)); // Загружаем курс
    }
    fetchLessons();
    fetchMaterials();
  }, [id, dispatch]);

  useEffect(() => {
    // Устанавливаем содержимое урока при переключении вкладок
    if (filteredLessons[activeTab]) {
      setLessonContent(filteredLessons[activeTab].content || "");
    }
  }, [activeTab, filteredLessons]);

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCompleteLesson = () => {
    if (!completedLessons.includes(filteredLessons[activeTab].id)) {
      setCompletedLessons([...completedLessons, filteredLessons[activeTab].id]);
    }
  };

  if (loading) return <Typography variant="h6">Загрузка...</Typography>;
  if (error) return <Typography variant="h6">Ошибка: {error}</Typography>;
  if (!filteredLessons || filteredLessons.length === 0) {
    return <Typography variant="h6">Нет доступных уроков.</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        bgcolor: "background.paper",
        minHeight: "100vh",
        padding: 2,
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

      {/* Контент активного урока */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            {/* Прогресс */}
            <ProgressIndicator completed={completedLessons.length} total={filteredLessons.length} />

            {/* Заголовок урока */}
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              {filteredLessons[activeTab].title}
            </Typography>

            {/* Текстовый редактор */}
            {/* <TextEditor
                  content={lessonContent}
                  onUpdate={(newContent) => setLessonContent(newContent)}
                /> */}

              {/* <Tiptap/> */}

            {/* Изображение урока */}
            {filteredLessons[activeTab].image && (
              <Box
                component="img"
                src={filteredLessons[activeTab].image}
                alt={`Lesson ${activeTab + 1}`}
                sx={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  mb: 4,
                }}
              />
            )}

            {/* Видео-материалы */}
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Видео-материалы:
            </Typography>
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => (
                <VideoPlayer key={material.material_id} material={material} />
              ))
            ) : (
              <Typography variant="body1">Нет доступных видео.</Typography>
            )}

            {/* Другие материалы */}
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 4, mb: 2 }}>
              Дополнительные материалы:
            </Typography>
            {filteredMaterials.length > 0 ? (
              <List>
                {filteredMaterials.map((material) => (
                  <ListItem key={material.material_id}>
                    <ListItemText
                      primary={material.title}
                      secondary={`Тип: ${material.type}`}
                    />
                    <ListItemSecondaryAction>
                      <DownloadButton href={material.file_path} fileName={material.title || "file"} />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1">Нет доступных материалов.</Typography>
            )}
          </Paper>
        </motion.div>

        {/* Разделитель */}
        <Divider sx={{ my: 4 }} />

        {/* Панель действий */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mt: 4,
          }}
        >
          {/* Кнопка "Завершить урок" */}
          <Button
            variant="contained"
            color={completedLessons.includes(filteredLessons[activeTab].id) ? "success" : "primary"}
            disabled={completedLessons.includes(filteredLessons[activeTab].id)} // Блокируем кнопку, если урок завершен
            sx={{
              flexGrow: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleCompleteLesson}
          >
            {completedLessons.includes(filteredLessons[activeTab].id)
              ? "Урок завершен"
              : "Завершить урок"}
          </Button>

          {/* Кнопка "Назад к курсам" */}
          <Button
            variant="outlined"
            color="primary"
            sx={{
              flexGrow: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={() => router.push("/courses")}
          >
            Назад к курсам
          </Button>
        </Box>
      </Box>
    </Box>
  );
}