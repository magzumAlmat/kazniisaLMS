"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../store/slices/authSlice";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import TopMenu from "../../components/topmenu";
import { useRouter } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981",
      contrastText: "#fff",
    },
    secondary: {
      main: "#3b82f6",
    },
    background: {
      default: "#1f2937",
      paper: "#374151",
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
});

export default function LibraryPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_HOST;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке информации о пользователе:", error);
      if (error.response && error.response.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!token || loading) {
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
            py: { xs: 4, md: 8, lg: 4 },
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 5 },
                textAlign: "center",
                bgcolor: theme.palette.background.paper,
                borderRadius: "12px",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{ mb: 2, fontSize: { xs: "1.75rem", md: "2.25rem" } }}
              >
                Библиотека
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 3,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                }}
              >
                Электронная библиотека учебных материалов, литературы и нормативно-технической документации.
              </Typography>

              <Divider
                sx={{
                  my: 3,
                  borderColor: theme.palette.primary.light,
                  borderWidth: "1px",
                }}
              />

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  textAlign: "center",
                  fontSize: "1.1rem",
                  py: 4,
                }}
              >
                Раздел библиотеки находится в процессе наполнения.
              </Typography>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
