"use client";
import React, { useState, useEffect } from "react";
import { Container, Box, AppBar, Toolbar, Typography, Button, Paper, Grow } from "@mui/material";
import Link from "next/link";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesAction } from "@/store/slices/authSlice";

export default function Layout({ children }) {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const userData = useSelector((state) => state.auth.currentUser);
  const [userInfo, setUserInfo] = useState([]);
  const token = localStorage.getItem("token");
  const [lessons, setLessons] = useState([]);
  const { courses, loadingCourses, coursesError } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [progress, setProgress] = useState([]);

  let UserID = userInfo.id;

  if (!token) {
    console.error("Token not available");
    return null;
  }

  let decodedToken;
  try {
    decodedToken = jwtDecode(token);
    console.log("Decoded token:", decodedToken, decodedToken.username);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }

  useEffect(() => {
    fetchProgresses();
    fetchUserInfo();
    dispatch(getAllCoursesAction());
    fetchLessons();
  }, []);

  useEffect(() => {
    if (progress.length > 0) {
      console.log("Fetched progresses:", progress);
    }
  }, [progress]);

  const fetchLessons = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/lessons");
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/auth/getAuthentificatedUserInfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setUserInfo(response.data);
      } else {
        console.error("Server returned an error:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user info:", error.message);
    }
  };

  const fetchProgresses = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/progresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setProgress(response.data);
      } else {
        console.error("Server returned an error:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching progresses:", error.message);
    }
  };
  const renderMenuByRole = () => {
    if (userInfo.roleId === 1) {
      // Администратор
      return (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} href="/layout">
            Главная
          </Button>
          <Button color="inherit" component={Link} href="/courses">
            Курсы
          </Button>
          <Button color="inherit" component={Link} href="/profile">
            Профиль
          </Button>
          <Button color="inherit" component={Link} href="/admin">
            Админ-панель
          </Button>
        </Box>
      );
    } else if (userInfo.roleId === 2) {
      // Учитель
      return (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} href="/layout">
            Главная
          </Button>
          <Button color="inherit" component={Link} href="/teacher/courses">
            Мои курсы
          </Button>
          <Button color="inherit" component={Link} href="/teacher/students">
            Студенты
          </Button>
          <Button color="inherit" component={Link} href="/profile">
            Профиль
          </Button>
        </Box>
      );
    } else if (userInfo.roleId === 3) {
      // Студент
      return (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} href="/layout">
            Главная
          </Button>
          <Button color="inherit" component={Link} href="/student/courses">
            Курсы
          </Button>
          <Button color="inherit" component={Link} href="/student/progress">
            Прогресс
          </Button>
          <Button color="inherit" component={Link} href="/profile">
            Профиль
          </Button>
        </Box>
      );
    } else {
      // Роль не определена
      return (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} href="/layout">
            Главная
          </Button>
          <Button color="inherit" component={Link} href="/login">
            Войти
          </Button>
        </Box>
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#f4f6f8",
        fontFamily: "'Roboto', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Верхнее меню */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#1976d2", borderBottom: "2px solid #1565c0" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "#fff" }}>
            Учебная платформа
          </Typography>
          {renderMenuByRole()}
        </Toolbar>
      </AppBar>

      {/* Основной контейнер */}
      <Container maxWidth="md" sx={{ mt: 4, flexGrow: 1 }}>
        <h1>Привет {userInfo.name}</h1>
        <Grow in={true} timeout={1000}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: "white", width: "100%" }}>
            {children}
            <Box sx={{ mt: 4 }}>{renderContentByRole(userInfo,progress,UserID)}</Box>
          </Paper>
        </Grow>
      </Container>

      {/* Футер */}
      <Box component="footer" sx={{ textAlign: "center", p: 2, bgcolor: "#e0e0e0", mt: "auto" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#555" }}>
          © 2025 Учебная платформа. Все права защищены.
        </Typography>
      </Box>
    </Box>
  );
}

// Функция для вывода контента в зависимости от роли
const renderContentByRole = (userInfo,progress,UserID) => {
  if (userInfo.roleId === 1) {
    // Администратор
    return (
      <Box>
        <Typography variant="h5">Админ-панель</Typography>
        <ul>
          {courses.map((course) => (
            <li key={course.id}>{course.title}</li>
          ))}
        </ul>
      </Box>
    );
  } else if (userInfo.roleId === 2) {
    // Учитель
    return (
      <Box>
        <Typography variant="h5">Панель учителя</Typography>
        <ul>
          {progress
            .filter((item) => item.user_id === UserID)
            .map((item) => {
              const lesson = lessons.find((les) => les.id === item.lesson_id);
              return (
                <li key={item.id}>
                  Статус: {item.status} по предмету {lesson?.title || lesson?.content}
                </li>
              );
            })}
        </ul>
      </Box>
    );
  } else if (userInfo.roleId === 3) {
    // Студент
    const latestItem = progress
      .filter((item) => item.user_id === UserID)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if (latestItem) {
      const lesson = lessons.find((les) => les.id === latestItem.lesson_id);
      return (
        <Box>
          <Typography variant="h5">Последний прогресс</Typography>
          <ul>
            <li>
              Статус: {latestItem.status} по предмету {lesson?.title || lesson?.content}
            </li>
          </ul>
        </Box>
      );
    } else {
      return <Typography variant="body1">No data available</Typography>;
    }
  } else {
    return <Typography variant="body1">Роль не определена</Typography>;
  }
};