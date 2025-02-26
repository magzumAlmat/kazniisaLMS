"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Next.js 13+
import axios from "axios";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
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
      {/* <DownloadButton href={material.file_path} fileName={material.title || "video.mp4"} /> */}
    </Box>
  );
};
export default function CourseDetail() {
  const { id } = useParams(); // Получаем id из URL
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const editorInstance = useRef(null); // Ссылка на экземпляр Editor.js

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
    fetchLessons();
    fetchMaterials();
  }, [id]);

  useEffect(() => {
    // Инициализация Editor.js в режиме только для чтения
    if (filteredLessons[activeTab] && filteredLessons[activeTab].content) {
      const content = JSON.parse(filteredLessons[activeTab].content);

      // Уничтожаем предыдущий экземпляр, если он существует
      if (editorInstance.current) {
        try {
          editorInstance.current.destroy();
        } catch (error) {
          console.warn("Ошибка при уничтожении предыдущего экземпляра Editor.js:", error);
        }
        editorInstance.current = null;
      }

      // Создаем новый экземпляр Editor.js
      const editor = new EditorJS({
        holder: "editorjs-container", // ID контейнера для редактора
        readOnly: true, // Режим только для чтения
        data: content, // Данные для отображения
        tools: {
          header: Header,
          list: List,
          paragraph: Paragraph,
        },
      });

      editorInstance.current = editor;
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

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCompleteLesson = () => {
    if (!completedLessons.includes(filteredLessons[activeTab].id)) {
      setCompletedLessons([...completedLessons, filteredLessons[activeTab].id]);
    }
  };

  if (!filteredLessons || filteredLessons.length === 0) {
    return <Typography variant="h6">Нет доступных уроков.</Typography>;
  }

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
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {/* Прогресс */}
          <LinearProgress
            variant="determinate"
            value={(completedLessons.length / filteredLessons.length) * 100}
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1">
            Прогресс: {completedLessons.length} из {filteredLessons.length} уроков
          </Typography>

          {/* Заголовок урока */}
          <Typography variant="h4" sx={{ fontWeight: "bold", my: 2 }}>
            {filteredLessons[activeTab].title}
          </Typography>

          {/* Отображение содержимого урока с помощью Editor.js */}
          <Box id="editorjs-container" sx={{ mt: 2, minHeight: "200px" }} />

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
              <Box key={material.material_id} sx={{ mb: 2 }}>
               
                {videoMaterials.length > 0 ? (
                      videoMaterials.map((material) => (
                        <Typography variant="subtitle1">{material.title}</Typography>,
                        <VideoPlayer key={material.material_id} material={material} />
                      ))
                    ) : (
                      <Typography variant="body1">Нет доступных видео.</Typography>
                    )}
              
              </Box>
            ))
          ) : (
            <Typography variant="body1">Нет доступных видео.</Typography>
          )}

          {/* Дополнительные материалы */}
          <Typography variant="h5" sx={{ fontWeight: "bold", mt: 4, mb: 2 }}>
            Дополнительные материалы:
          </Typography>
          {filteredMaterials.length > 0 ? (
            <MuiList>
              {filteredMaterials.map((material) => (
                <ListItem key={material.material_id}>
                  <ListItemText primary={material.title} secondary={`Тип: ${material.type}`} />
                  <Button
                    href={material.file_path}
                    download={material.title || "file"}
                    variant="outlined"
                    color="primary"
                  >
                    Скачать
                  </Button>
                </ListItem>
              ))}
            </MuiList>
          ) : (
            <Typography variant="body1">Нет доступных материалов.</Typography>
          )}
        </Paper>

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
            disabled={completedLessons.includes(filteredLessons[activeTab].id)}
            onClick={handleCompleteLesson}
            sx={{
              flexGrow: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            {completedLessons.includes(filteredLessons[activeTab].id)
              ? "Урок завершен"
              : "Завершить урок"}
          </Button>

          {/* Кнопка "Назад к курсам" */}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => router.push("/courses")}
            sx={{
              flexGrow: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Назад к курсам
          </Button>
        </Box>
      </Box>
    </Box>
  );
}