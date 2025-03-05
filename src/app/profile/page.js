"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import TopMenu from "@/components/topmenu";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutAction } from "@/store/slices/authSlice";
import { Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem("token");
  const [profileData, setProfileData] = useState({
    name: "",
    lastname: "",
    phone: "",
    areasofactivity: "", // Добавляем новое поле
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_HOST;

  // Список значений для areasofactivity
  const activityOptions = [
    "Управление строительными проектами",
    "Проектирование",
    "Экспертиза и оценка соответствия",
    "Производство строительных работ",
    "Контроль и надзор",
    "Девелопмент и недвижимость",
  ];

  useEffect(() => {
    if (!token) {
      console.log("token is null", token);
      router.push("/login");
      return;
    }
    fetchProfile();
    fetchUserInfo();
  }, [router]);

  const fetchProfile = async () => {
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
        areasofactivity: response.data.areasofactivity ?? "", // Добавляем areasofactivity
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
    console.log('ProfileData',profileData)
    e.preventDefault();
    try {
      await axios.put(
        `${host}/api/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Профиль успешно обновлен!");
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else {
          alert(`Ошибка: ${error.response.data.message || "Попробуйте позже."}`);
        }
      } else {
        alert("Не удалось подключиться к серверу.");
      }
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
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
      </Box>
    </>
  );
};

export default ProfilePage;