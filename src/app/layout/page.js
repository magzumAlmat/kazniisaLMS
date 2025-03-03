"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  Grow,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesAction, logoutAction } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import TopMenu from "@/components/topmenu";

export default function Layout({ children }) {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null); // Инициализируем токен как null
  const [lessons, setLessons] = useState([]);
  const { courses } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false); // Состояние для Drawer

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
      fetchUserInfo();
      dispatch(getAllCoursesAction());
    }
  }, [token, dispatch]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/auth/getAuthentificatedUserInfo", {
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

  const fetchLessons = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/lessons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
      setLessons([]);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  const renderMenuByRole = () => {
    if (!userInfo) return [];

    const menuItems = {
      1: [
        { text: "Главная", href: "/layout" },
        { text: "Добавить роль", href: "/addrole" },
        { text: "Профиль", href: "/profile" },
        { text: "Админ-панель", href: "/admin" },
        { text: "Выйти", onClick: handleLogout },
      ],
      2: [
        { text: "Главная", href: "/layout" },
        { text: "Потоки", href: "/addstreams" },
        { text: "Курсы", href: "/addcourse" },
        { text: "Предметы", href: "/addlessons" },
        { text: "Материалы", href: "/addmaterial" },
        { text: "Прогресс", href: "/progressstatus" },
        { text: "Профиль", href: "/profile" },
        { text: "Выйти", onClick: handleLogout },
      ],
      3: [
        { text: "Главная", href: "/layout" },
        { text: "Курсы", href: "/courses" },
        { text: "Прогресс", href: "/progress" },
        { text: "Профиль", href: "/profile" },
        { text: "Выйти", onClick: handleLogout },
      ],
    };

    return menuItems[userInfo.roleId] || [
      { text: "Главная", href: "/layout" },
      { text: "Выйти", onClick: handleLogout },
    ];
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerMenu = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {renderMenuByRole().map((item, index) => (
          <ListItem
            key={index}
            component={item.href ? Link : "button"}
            href={item.href}
            onClick={item.onClick}
            sx={{ color: "#1976d2" }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (!token) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
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
      {/* Верхнее меню */}
      <AppBar position="static" sx={{ bgcolor: "#1976d2", borderBottom: "2px solid #1565c0" }}>
        <Toolbar
          sx={{
            flexWrap: "wrap",
            justifyContent: { xs: "space-between", sm: "space-between" },
            py: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#fff", fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Kazniisa LMS
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: { sm: 2, md: 3 } }}>
            {renderMenuByRole().map((item, index) => (
              <Button
                key={index}
                color="inherit"
                component={item.href ? Link : "button"}
                href={item.href}
                onClick={item.onClick}
                sx={{ fontSize: { sm: "0.875rem", md: "1rem" }, px: { sm: 1, md: 2 } }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: "block", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerMenu}
      </Drawer>

      {/* Основной контейнер */}
      <Container
        sx={{
          mt: { xs: 2, sm: 4 },
          flexGrow: 1,
          px: { xs: 1, sm: 2 },
          maxWidth: { xs: "100%", sm: "md" },
        }}
      >
        <Grow in={true} timeout={1000}>
          <Paper
            elevation={4}
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: 3,
              bgcolor: "white",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="h5"
              sx={{ mb: 2, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
            >
              Привет, {userInfo?.name || "Гость"}
            </Typography>
            {children}
          </Paper>
        </Grow>
      </Container>

      {/* Футер */}
      <Box
        component="footer"
        sx={{
          textAlign: "center",
          py: 2,
          bgcolor: "#e0e0e0",
          mt: "auto",
          px: { xs: 1, sm: 2 },
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", color: "#555", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
        >
          © 2025 Учебная платформа. Все права защищены.
        </Typography>
      </Box>
    </Box>
  );
}