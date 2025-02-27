"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Next.js 13+

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
import { useSelector, useDispatch } from "react-redux";
import {
  getUserInfoAction,
  getAllCoursesAction,
} from "@/store/slices/authSlice";
import TopMenu from "@/components/topmenu";
import { logoutAction } from "@/store/slices/authSlice";
import jwtDecode from "jwt-decode";
import axios from "axios";

import useTokenFromURL from "@/components/useTokenFromURL";
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
  const { id } = useParams(); // Получаем id из URL
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const editorInstance = useRef(null); // Ссылка на экземпляр Editor.js
  const { courses, loadingCourses, coursesError } = useSelector((state) => state.auth);
  const userData = useSelector((state) => state.auth.currentUser);
  const [progresses, setProgresses] = useState([]);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [userInfo, setUserInfo] = useState(null); // Инициализируем как null
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [course,setCourse]=useState(null)
 const isAuth = useSelector((state) => state.auth.isAuth);
  // Загрузка уроков


let decodedToken;
  try {
    decodedToken = jwtDecode(token);
    console.log("Decoded token:", decodedToken);
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    window.location.href = "/login"; // Перенаправляем на страницу входа
    return null;
  }
  console.log("1. URL search params:", window.location.search);
  console.log("2. Token from URL:", token);

  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("3. Decoded token:", decoded);
      localStorage.setItem("token", token);
      console.log("4. Token saved to localStorage:", localStorage.getItem("token"));
    } catch (error) {
      console.error("5. Invalid token:", error.message);
    }
  } else {
    console.error("6. Token not found in URL");
  }

  // Вызов хука для обработки токена из URL
  useTokenFromURL();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
         fetchCourses()
       
        //  dispatch(getUserInfo());
         fetchUserInfo()
         fetchLessons();
        //  fetchProgresses();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
    
  }, [dispatch]);




  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/courses");
    
      console.log('fetch courses',response.data[0].id)
      setCourse(response.data[0].id)
    } catch (error) {
      console.error("Ошибка при загрузке курсов:", error);
    }
  };

  
  
  console.log('loadingCurse= ',loadingCourses,course)
 

    // Инициализация прогресса
    const initializeProgress = async () => {
      
      const decoded = jwtDecode(token);

      // console.log('initializeProgress started userData=',decoded,'courses= ',courses)
      try {
        if (!decoded || !course  === 0) {
          console.log('initializeProgress started userData=',decoded,'courses= ',course.id)
          console.error("Недостаточно данных для инициализации прогресса.");
          return;
        }
        const response =  axios.post("http://localhost:4000/course/enroll", {
          user_id: decoded.id,
          course_id: course,
        });
        console.log("Initial progress created:", response.data);
        fetchAllProgresses(decoded.id);
      } catch (error) {
        console.error("Ошибка при инициализации прогресса:", error);
      }
    };
  
    // Получение всех записей о прогрессе пользователя
    const fetchAllProgresses = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:4000/progress/all/${userId}`);
        setProgresses(response.data);
      } catch (error) {
        console.error("Ошибка при получении прогресса:", error);
      }
    };

  // if (!loadingCourses) {
  //   console.log(' LOADER loadingCurse= ',loadingCourses)
  //   return (
  //     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
  //       <Typography variant="h6">Загрузка данных пользователя...</Typography>
  //       <LinearProgress />
  //     </Box>
  //   );
  // }
  // Функция для загрузки уроков
  const fetchUserInfo = async () => {
    console.log('fetchUserInfo started!')
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

  const fetchLessons = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/lessons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error.response?.data || error.message);
      setLessons([]);
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
    let completedRequests = 0; // Счетчик завершенных запросов
    const totalRequests = 5; // Общее количество запросов

    const checkLoadingComplete = () => {
      completedRequests++;
      if (completedRequests === totalRequests) {
        setLoading(false); // Все запросы завершены
      }
    };

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 10000; // Время в секундах
    
      if (decodedToken.exp < currentTime) {
        console.error("Token expired");
        // Перенаправляем пользователя на страницу входа
        localStorage.removeItem("token");
        // window.location.href = "/login";
        return null;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      // Перенаправляем пользователя на страницу входа
      localStorage.removeItem("token");
      // window.location.href = "/login";
      return null;
    }

 

    // Выполнение всех запросов
    const fetchData = async () => {
      try {
        // dispatch(getUserInfoAction);
        await fetchLessons();
        await fetchMaterials();
        dispatch(getAllCoursesAction());
        // await fetchUserInfo();
        await initializeProgress();
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        checkLoadingComplete();
      }
    };

    fetchData();
  }, [id, dispatch]);

  
  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLogout = () => {
      dispatch(logoutAction());
      localStorage.removeItem("token");
      window.location.href = "/login";
    };
  
  const handleCompleteLesson = () => {
    if (!completedLessons.includes(filteredLessons[activeTab].id)) {
      setCompletedLessons([...completedLessons, filteredLessons[activeTab].id]);
    }
  };

  if (!filteredLessons || filteredLessons.length === 0) {
    return <Typography variant="h6">Нет доступных уроков.</Typography>;
  }

  // if (courseId) {
  //   return (
  //     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
  //     {/* Отображение индикатора загрузки */}
  //     <Box>
  //       <Typography variant="h6">Загрузка...</Typography>
  //       <LinearProgress />
  //     </Box>
  //   </Box>
  //   );
  // }

  if (!filteredLessons || filteredLessons.length === 0) {
    return <div>Нет доступных уроков.</div>;
  }

  const videoMaterials = filteredMaterials.filter((material) => material.type === "video");

  return (<>

    <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
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
    </>
  );}