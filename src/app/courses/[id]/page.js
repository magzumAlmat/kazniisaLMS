"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Next.js 13+
import { useDispatch, useSelector } from "react-redux";
import { getCourseByIdAction } from "@/store/slices/authSlice";
import axios from "axios";
import {
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
  Typography,
  styled,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";

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

export default function CourseDetail() {
  const { id } = useParams(); // Получаем id из URL
  const router = useRouter();
  const dispatch = useDispatch();
  const thisCourse = useSelector((state) => state.auth.currentCourse);
  const loading = useSelector((state) => state.auth.loadingCourse);
  const error = useSelector((state) => state.auth.courseError);

  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]); // Отдельное состояние для материалов
  const [activeTab, setActiveTab] = React.useState(0); // Текущая активная вкладка

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

  if (loading) return <Typography variant="h6">Загрузка...</Typography>;
  if (error) return <Typography variant="h6">Ошибка: {error}</Typography>;

  // Проверка на наличие данных
  if (!filteredLessons || filteredLessons.length === 0) {
    return <Typography variant="h6">Нет доступных уроков.</Typography>;
  }

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Фильтруем только видео-материалы
  const videoMaterials = filteredMaterials.filter((material) => material.type === "video");

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
      {/* Вертикальные вкладки */}
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={activeTab}
        onChange={handleChangeTab}
        aria-label="Уроки курса"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          width: "250px",
          backgroundColor: "background.default",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {filteredLessons.map((lesson) => (
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
            {/* Заголовок урока */}
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              {filteredLessons[activeTab].title}
            </Typography>

            {/* Описание урока */}
            <Typography variant="body1" sx={{ mb: 4 }}>
              {filteredLessons[activeTab].content}
            </Typography>

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
            {videoMaterials.length > 0 ? (
              videoMaterials.map((material) => (
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

        {/* Кнопка "Назад к курсам" */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 4,
            display: "block",
            margin: "auto",
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
  );
}