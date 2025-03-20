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
          <Typography variant="h6" color="error" align="center">
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
          <Typography variant="h6" color="error" align="center">
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
      
      </Box>
    </ThemeProvider>
  );
>>>>>>> f554779886600750645b4c7d8a379e3867203ec5
}