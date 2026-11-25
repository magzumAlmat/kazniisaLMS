"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesAction, logoutAction } from "../../store/slices/authSlice";
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  Box,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Link from "next/link";
import TopMenu from "../../components/topmenu";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981", // Emerald 500
      contrastText: "#fff",
    },
    secondary: {
      main: "#3b82f6", // Blue 500
    },
    background: {
      default: "#1f2937", // Gray 800
      paper: "#374151", // Gray 700
    },
    text: {
      primary: "#fff",
      secondary: "#d1d5db",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: { fontWeight: 600 },
    h6: { fontWeight: 500 },
    body2: { fontWeight: 400 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          padding: "10px 20px",
          fontWeight: 600,
          transition: "all 0.2s ease-in-out",
        },
      },
    },
  },
});

export default function LayoutMain() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { courses, loadingCourses, coursesError } = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const host = process.env.NEXT_PUBLIC_HOST || "https://lms.kazniisa.kz";

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      dispatch(getAllCoursesAction());
      fetchUserInfo();
    }
  }, [token, dispatch]);

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

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!token || loadingCourses) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: theme.palette.background.default,
          }}
        >
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh" }}>
        <TopMenu userInfo={userInfo} handleLogout={handleLogout} />

        <Box
          sx={{
            bgcolor: theme.palette.background.default,
            minHeight: "calc(100vh - 64px)",
            py: { xs: 4, md: 8, lg: 6 },
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 5 },
                textAlign: "center",
                bgcolor: theme.palette.background.paper,
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  mb: 2.5,
                  fontWeight: 700,
                  fontSize: { xs: "1.75rem", md: "2.3rem" },
                  color: "#fff",
                }}
              >
                Добро пожаловать на платформу buildingSmart Kazakhstan!
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 3,
                  fontSize: { xs: "1.05rem", md: "1.15rem" },
                }}
              >
                Образовательная платформа по информационному моделированию для специалистов строительной отрасли.
              </Typography>

              <Divider
                sx={{
                  my: 3,
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  borderWidth: "1px",
                }}
              />

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  mb: 3,
                  fontSize: { xs: "1rem", md: "1.05rem" },
                  textAlign: "left",
                  lineHeight: 1.6,
                }}
              >
                Здесь вы найдете курсы, разработанные с учетом практических задач и требований современного строительства. Осваивайте инструменты BIM, повышайте квалификацию и внедряйте цифровые технологии на всех этапах жизненного цикла объекта — от проектирования до эксплуатации.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  mb: 4,
                  fontSize: { xs: "1rem", md: "1.05rem" },
                  textAlign: "left",
                  lineHeight: 1.6,
                }}
              >
                Платформа создана для тех, кто хочет работать эффективно, точно и в соответствии с актуальными стандартами и технологиями. В разделе электронной библиотеки вам доступны нормативные стандарты СТ РК ISO 19650, руководства openBIM и исследования рынка.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
                sx={{ mt: 3 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  href="/courses"
                  startIcon={<SchoolIcon />}
                  sx={{
                    fontSize: "1rem",
                    py: 1.3,
                    px: 3.5,
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                  }}
                >
                  Перейти к курсам
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  href="/library"
                  startIcon={<MenuBookIcon />}
                  sx={{
                    fontSize: "1rem",
                    py: 1.3,
                    px: 3.5,
                    color: "#fff",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      bgcolor: "rgba(16, 185, 129, 0.1)",
                    },
                  }}
                >
                  Электронная библиотека
                </Button>
              </Stack>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
