<<<<<<< HEAD
"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesAction, logoutAction } from "../../store/slices/authSlice";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import Link from "next/link";
import TopMenu from "../../components/topmenu";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

// Тема в стиле Next.js Template от lucasbaquinoo
const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981", // Зеленый акцент (emerald-500)
      contrastText: "#fff",
    },
    secondary: {
      main: "#3b82f6", // Синий акцент (blue-500)
    },
    background: {
      default: "#1f2937", // Темно-серый фон (gray-800)
      paper: "#374151", // Чуть светлее для панелей (gray-700)
    },
    text: {
      primary: "#fff",
      secondary: "#d1d5db", // Светло-серый для текста (gray-300)
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
          padding: "8px 16px",
          transition: "all 0.2s ease-in-out",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)",
          },
        },
      },
    },
  },
});

export default function Courses() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation(); // Добавляем хук для переводов
  const { courses, loadingCourses, coursesError } = useSelector((state) => state.auth);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const [userInfo, setUserInfo] = useState(null);
  const [progresses, setProgresses] = useState({});
  const [token, setToken] = useState(null);
  const host = process.env.NEXT_PUBLIC_HOST;

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

  const fetchAllProgresses = async (userId, courseId) => {
    try {
      const response = await axios.get(`${host}/api/course/progress/${userId}/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.course_progress;
      setProgresses((prev) => ({
        ...prev,
        [courseId]: data,
      }));
    } catch (error) {
      console.error("Ошибка при получении прогресса:", error);
    }
  };

  useEffect(() => {
    if (userInfo && courses && courses.length > 0 && token) {
      courses.forEach((course) => {
        fetchAllProgresses(userInfo.id, course.id);
      });
    }
  }, [userInfo, courses, token]);

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
          <Typography sx={{ ml: 2, color: theme.palette.text.primary }}>
            {t("courses.loading")}
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (coursesError) {
    return (
      <ThemeProvider theme={theme}>
        <Container sx={{ py: 4, bgcolor: theme.palette.background.default }}>
          <Typography
            variant="h6"
            color="error"
            align="center"
            sx={{ color: "#ef4444", fontSize: "1.5rem" }}
          >
            {t("courses.error", { message: coursesError })}
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh" }}>
        <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
        <Container
          sx={{
            py: { xs: 4, sm: 6 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: theme.palette.text.primary,
              textAlign: "center",
              mb: { xs: 4, sm: 6 },
              fontSize: { xs: "1.75rem", sm: "2.25rem" },
            }}
          >
            {t("courses.title")}
          </Typography>
          {courses.length === 0 ? (
            <Typography
              variant="h6"
              align="center"
              sx={{ color: theme.palette.text.secondary, fontSize: "1.5rem" }}
            >
              {t("courses.noCourses")}
            </Typography>
          ) : (
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
              {courses.map((course) => (
                <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{
                          color: theme.palette.text.primary,
                          fontSize: { xs: "1.125rem", sm: "1.25rem" },
                        }}
                      >
                        {course.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          mb: 1,
                        }}
                      >
                        {course.description || t("courses.descriptionPlaceholder")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.secondary.main,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        {t("courses.progress", { value: progresses[course.id] || 0 })}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2 }}>
                      <Button
                        component={Link}
                        href={`/courses/${course.id}`}
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          py: 1,
                          "&:hover": {
                            bgcolor: theme.palette.primary.dark,
                            transform: "scale(1.02)",
                          },
                        }}
                      >
                        {t("courses.goToCourse")}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
=======
"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesAction, logoutAction } from "../../store/slices/authSlice";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import Link from "next/link";
import TopMenu from "../../components/topmenu";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Тема в стиле Next.js Template от lucasbaquinoo
const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981", // Зеленый акцент (emerald-500)
      contrastText: "#fff",
    },
    secondary: {
      main: "#3b82f6", // Синий акцент (blue-500)
    },
    background: {
      default: "#1f2937", // Темно-серый фон (gray-800)
      paper: "#374151", // Чуть светлее для панелей (gray-700)
    },
    text: {
      primary: "#fff",
      secondary: "#d1d5db", // Светло-серый для текста (gray-300)
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
          padding: "8px 16px",
          transition: "all 0.2s ease-in-out",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)",
          },
        },
      },
    },
  },
});

export default function Courses() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { courses, loadingCourses, coursesError } = useSelector((state) => state.auth);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const [userInfo, setUserInfo] = useState(null);
  const [progresses, setProgresses] = useState({});
  const [token, setToken] = useState(null);
  const host = process.env.NEXT_PUBLIC_HOST;

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

  const fetchAllProgresses = async (userId, courseId) => {
    try {
      const response = await axios.get(`${host}/api/course/progress/${userId}/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.course_progress;
      setProgresses((prev) => ({
        ...prev,
        [courseId]: data,
      }));
    } catch (error) {
      console.error("Ошибка при получении прогресса:", error);
    }
  };

  useEffect(() => {
    if (userInfo && courses && courses.length > 0 && token) {
      courses.forEach((course) => {
        fetchAllProgresses(userInfo.id, course.id);
      });
    }
  }, [userInfo, courses, token]);

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

  if (coursesError) {
    return (
      <ThemeProvider theme={theme}>
        <Container sx={{ py: 4, bgcolor: theme.palette.background.default }}>
          <Typography
            variant="h6"
            color="error"
            align="center"
            sx={{ color: "#ef4444", fontSize: "1.5rem" }}
          >
            Ошибка: {coursesError}
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh" }}>
        <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
        <Container
          sx={{
            py: { xs: 4, sm: 6 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: theme.palette.text.primary,
              textAlign: "center",
              mb: { xs: 4, sm: 6 },
              fontSize: { xs: "1.75rem", sm: "2.25rem" },
            }}
          >
            Доступные курсы
          </Typography>
          {courses.length === 0 ? (
            <Typography
              variant="h6"
              align="center"
              sx={{ color: theme.palette.text.secondary, fontSize: "1.5rem" }}
            >
              Нет доступных курсов.
            </Typography>
          ) : (
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
              {courses.map((course) => (
                <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{
                          color: theme.palette.text.primary,
                          fontSize: { xs: "1.125rem", sm: "1.25rem" },
                        }}
                      >
                        {course.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          mb: 1,
                        }}
                      >
                        {course.description || "Описание отсутствует."}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.secondary.main,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Прогресс: {progresses[course.id] || 0}%
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2 }}>
                      <Button
                        component={Link}
                        href={`/courses/${course.id}`}
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          py: 1,
                          "&:hover": {
                            bgcolor: theme.palette.primary.dark,
                            transform: "scale(1.02)",
                          },
                        }}
                      >
                        Перейти к курсу
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
>>>>>>> f554779886600750645b4c7d8a379e3867203ec5
}