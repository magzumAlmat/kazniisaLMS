"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import TopMenu from "../../components/topmenu";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../store/slices/authSlice";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import jwtDecode from "jwt-decode";

// Создаем тему
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
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            borderColor: "#4b5563", // Gray-600
            "&:hover fieldset": {
              borderColor: "#10b981", // Зеленый при наведении
            },
          },
        },
      },
    },
  },
});

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    lastname: "",
    phone: "",
    areasofactivity: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_HOST;

  const activityOptions = [
    "Управление строительными проектами",
    "Проектирование",
    "Экспертиза и оценка соответствия",
    "Производство строительных работ",
    "Контроль и надзор",
    "Девелопмент и недвижимость",
  ];

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!storedToken) {
      router.push("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(storedToken);
      setToken(storedToken);
    } catch (error) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;

    fetchProfile();
    fetchUserInfo();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${host}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData({
        name: response.data.name ?? "",
        lastname: response.data.lastname ?? "",
        phone: response.data.phone ?? "",
        areasofactivity: response.data.areasofactivity ?? "",
      });
    } catch (error) {
      console.error("Ошибка при загрузке профиля:", error);
      if (error.response?.status === 401) {
        router.push("/login");
      }
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке информации о пользователе:", err);
      if (err.response?.status === 401) {
        router.push("/login");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setOpenSnackbar(false);

    try {
      const response = await axios.put(
        `${host}/api/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage(response.data.message || "Профиль успешно обновлен");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else {
          const message = error.response.data?.message || "Произошла ошибка при обновлении профиля";
          setErrorMessage(message);
          setOpenSnackbar(true);
        }
      } else {
        setErrorMessage("Не удалось подключиться к серверу");
        setOpenSnackbar(true);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <ThemeProvider theme={theme}>
      <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            py: 6,
            px: 4,
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: theme.palette.text.primary,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            Мой профиль
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ marginBottom: "15px" }}>
              <TextField
                label="Имя"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                placeholder="Введите имя"
                required
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box sx={{ marginBottom: "15px" }}>
              <TextField
                label="Фамилия"
                name="lastname"
                value={profileData.lastname}
                onChange={handleChange}
                placeholder="Введите фамилию"
                required
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box sx={{ marginBottom: "15px" }}>
              <TextField
                label="Телефон"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                placeholder="Введите телефон"
                required
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box sx={{ marginBottom: "15px" }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Сфера деятельности</InputLabel>
                <Select
                  name="areasofactivity"
                  value={profileData.areasofactivity}
                  onChange={handleChange}
                  label="Сфера деятельности"
                  required
                >
                  <MenuItem value="">
                    <em>Выберите сферу</em>
                  </MenuItem>
                  {activityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                "&:hover": {
                  bgcolor: "#059669", // Темнее зеленого
                },
              }}
            >
              Сохранить
            </Button>
          </form>

          {/* Snackbar для сообщений */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={errorMessage ? "error" : "success"}
              sx={{ width: "100%" }}
            >
              {errorMessage || successMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ProfilePage;