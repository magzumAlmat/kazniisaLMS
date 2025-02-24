"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Next.js 13+
import { useDispatch, useSelector } from "react-redux";
import { getCourseByIdAction } from "@/store/slices/authSlice";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";



const VideoPlayer = ({ videoUrl }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    fetch(videoUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = 'http://localhost:4000/static/%D0%9A%D0%BF_%D0%BF%D0%BE_cleanSe.MP4';
        setSrc(url);
      })
      .catch((error) => console.error("Ошибка:", error));
  }, [videoUrl]);

  return src ? (
    <video controls width="640" height="360">
      <source src={src} type="video/mp4" />
      Ваш браузер не поддерживает воспроизведение видео.
    </video>
  ) : (
    <p>Загрузка видео...</p>
  );
};


const DateFormatter = ({ isoDate }) => {
  const date = new Date(isoDate);
  const formattedDate = date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return <p>{formattedDate}</p>;
};

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.primary.main,
    width: 3, // Толщина индикатора для вертикальных вкладок
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  color: theme.palette.text.secondary,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
  "&:hover": {
    color: theme.palette.primary.main,
    opacity: 1,
  },
}));


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
  const theme = useTheme();

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

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  // Проверка на наличие данных
  if (!filteredLessons || filteredLessons.length === 0) {
    return <Typography variant="h6">Нет доступных уроков.</Typography>;
  }

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexGrow: 1, bgcolor: "background.paper", height: "100%" }}>
      {/* Вертикальные вкладки */}
      <StyledTabs
        orientation="vertical"
        variant="scrollable"
        value={activeTab}
        onChange={handleChangeTab}
        aria-label="Уроки курса"
        sx={{ borderRight: 1, borderColor: "divider", width: "200px" }}
      >
        {filteredLessons.map((lesson, index) => (
          <StyledTab key={lesson.id} label={lesson.title} />
        ))}
      </StyledTabs>

      {/* Контент активного урока */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5">{filteredLessons[activeTab].title}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {filteredLessons[activeTab].content}
            </Typography>
            {filteredLessons[activeTab].image && (
              <img
                src={filteredLessons[activeTab].image}
                alt={`Lesson ${activeTab + 1}`}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  marginTop: "10px",
                  borderRadius: "8px",
                }}
              />
            )}

            {/* Отображение материалов */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">Материалы:</Typography>
              <VideoPlayer />
              {filteredMaterials.length > 0 ? (
                <ul>
                  {filteredMaterials.map((material) => (
                    <li key={material.material_id}>
                      <Typography variant="subtitle1">{material.title}</Typography>
                      <Typography variant="body2">{material.type}</Typography>
                      <a href={material.file_path} target="_blank" rel="noopener noreferrer">
                        Скачать файл
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body1">Нет доступных материалов.</Typography>
              )}
            </Box>
          </Paper>
        </motion.div>

        {/* Кнопка "Назад к курсам" */}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4, display: "block", margin: "auto", borderRadius: 2 }}
          onClick={() => router.push("/courses")}
        >
          Назад к курсам
        </Button>
      </Box>
    </Box>
  );
}