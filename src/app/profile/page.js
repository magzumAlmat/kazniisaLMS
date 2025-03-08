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
} from "@mui/material"; // Добавляем Snackbar
import jwtDecode from "jwt-decode";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    lastname: "",
    phone: "",
    areasofactivity: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Для ошибок
  const [successMessage, setSuccessMessage] = useState(""); // Для успеха
  const [openSnackbar, setOpenSnackbar] = useState(false); // Управление видимостью Snackbar
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
    console.log("Stored token:", storedToken);

    if (!storedToken) {
      console.error("Token not available");
      router.push("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(storedToken);
      console.log("Decoded token:", decodedToken);
      setToken(storedToken);
    } catch (error) {
      console.error("Invalid token:", error.message);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!token) {
      console.log("Token is null, skipping fetch");
      return;
    }

    fetchProfile();
    fetchUserInfo();
  }, [token]);

  const fetchProfile = async () => {
    console.log("fetchProfile started");
    try {
      const response = await axios.get(`${host}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = {
        name: response.data.name ?? "",
        lastname: response.data.lastname ?? "",
        phone: response.data.phone ?? "",
        areasofactivity: response.data.areasofactivity ?? "",
      };
      setProfileData(data);
    } catch (error) {
      console.error("Ошибка при загрузке профиля:", error);
      if (error.response && error.response.status === 401) {
        router.push("/login");
      }
    }
  };

  const fetchUserInfo = async () => {
    console.log("fetchUserInfo started");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ProfileData:", profileData);
    setErrorMessage(""); // Сбрасываем ошибку
    setSuccessMessage(""); // Сбрасываем успех
    setOpenSnackbar(false); // Закрываем предыдущий Snackbar

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
      console.log("Response from server:", response.data); // Логируем ответ сервера
      setSuccessMessage(response.data.message || "Профиль успешно обновлен");
      setOpenSnackbar(true); // Показываем Snackbar с успехом
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      console.log("Error response:", error.response); // Логируем полный ответ об ошибке
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else {
          const message = error.response.data?.message || "Произошла ошибка при обновлении профиля";
          setErrorMessage(message);
          setOpenSnackbar(true); // Показываем Snackbar с ошибкой
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

  // Закрытие Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <>
      <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
      <Box sx={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
        <Typography variant="h4" gutterBottom>
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
            color="success"
            sx={{ padding: "10px 15px", borderRadius: "5px" }}
          >
            Сохранить
          </Button>
        </form>

        {/* Snackbar для сообщений */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000} // Скрывается через 6 секунд
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // Появляется сверху по центру
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
    </>
  );
};

export default ProfilePage;