"use client";
import React, { useState, useEffect } from "react";
import { Container, Box, Typography } from "@mui/material";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getAllCoursesAction } from "../../store/slices/authSlice";
import TopMenu from "../../components/topmenu";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Флаг для предотвращения редиректов
  const host = process.env.NEXT_PUBLIC_HOST;

  // Проверка токена и установка начального состояния
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    console.log("Stored token:", storedToken);

    // Если токена нет или он пустой, и мы не в процессе выхода, перенаправляем на логин
    if (!storedToken || storedToken.trim() === "" && !isLoggingOut) {
      console.log("No valid token found, redirecting to login...");
      router.push("/login");
      return;
    }

    // Если мы в процессе выхода, ничего не делаем
    if (isLoggingOut) {
      console.log("Currently logging out, skipping token check...");
      return;
    }

    // Проверяем и декодируем токен
    try {
      const decoded = jwtDecode(storedToken);
      console.log("Decoded token:", decoded);
      setToken(storedToken);
    } catch (error) {
      console.error("Invalid token:", error.message);
      if (!isLoggingOut) {
        console.log("Token is invalid, clearing and redirecting to login...");
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  }, [router, isLoggingOut]);

  // Загрузка данных после установки токена
  useEffect(() => {
    if (!token || isLoggingOut) return;

    const fetchInitialData = async () => {
      try {
        // Загрузка курсов через Redux
        dispatch(getAllCoursesAction())
          .then(() => {
            console.log("Courses fetched successfully");
          })
          .catch((error) => {
            console.error("Error fetching courses:", error);
          });

        // Загрузка информации о пользователе
        await fetchUserInfo();

        // Загрузка уроков
        await fetchLessons();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [token, dispatch, isLoggingOut]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке информации о пользователе:", err);
      if (err.response?.status === 401 && !isLoggingOut) {
        console.log("Unauthorized, redirecting to login...");
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${host}/api/lessons`);
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
      setLessons([]);
    }
  };

  // Обработчик выхода, переданный в TopMenu
  const handleLogout = () => {
    console.log("Logging out...");
    setIsLoggingOut(true); // Устанавливаем флаг перед выходом
    localStorage.removeItem("token");
    setToken(null); // Сбрасываем токен в состоянии
    router.push("/login");
  };

  // Если токена нет и мы не в процессе выхода, ничего не рендерим
  if (!token && !isLoggingOut) {
    console.log("No token and not logging out, rendering null...");
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
      <Container sx={{ mt: 4, flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
          Привет, {userInfo?.name || "Гость"}
        </Typography>
        {children}
      </Container>
      <Box component="footer" sx={{ textAlign: "center", p: 2, bgcolor: "#e0e0e0", mt: "auto" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#555" }}>
          © 2025 Учебная платформа. Все права защищены.
        </Typography>
      </Box>
    </Box>
  );
}