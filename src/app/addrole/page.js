"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Alert,
} from "@mui/material";
import jwtDecode from "jwt-decode";
import TopMenu from "../../components/topmenu";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function UpdateUserRolePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const host = process.env.NEXT_PUBLIC_HOST;

  // Инициализация токена и проверка его валидности
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
      setToken(storedToken); // Устанавливаем токен только после успешного декодирования
    } catch (err) {
      console.error("Invalid token:", err.message);
      localStorage.removeItem("token"); // Удаляем некорректный токен
      router.push("/login");
    }
  }, [router]);

  // Загрузка пользователей и данных пользователя
  useEffect(() => {
    if (!token) {
      return; // Ждем, пока токен не будет установлен
    }

    const fetchData = async () => {
      try {
        // Загрузка списка пользователей
        const usersResponse = await axios.get(`${host}/api/getallusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = usersResponse.data.users || [];
        console.log("Data from API:", usersData);
        setUsers(usersData);
        setFilteredUsers(usersData);

        // Загрузка информации о текущем пользователе
        const userInfoResponse = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(userInfoResponse.data);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          setError("Не удалось загрузить данные");
        }
      }
    };

    fetchData();
  }, [token, router]);

  // Фильтрация пользователей по почте
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!Array.isArray(users)) {
      console.error("Users is not an array");
      return;
    }

    const filtered = users.filter((user) =>
      (user.email || "").toLowerCase().includes(query)
    );
    console.log("Filtered users:", filtered);
    setFilteredUsers(filtered);
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Выбрана роль:", roleId);
    if (!userId || !roleId) {
      setError("Выберите пользователя и роль");
      return;
    }

    try {
      const response = await axios.put(
        `${host}/api/users/${userId}/role`,
        { roleId: Number(roleId) }, // Убедимся, что roleId отправляется как число
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(response.data.message || "Роль успешно обновлена");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Произошла ошибка");
      setMessage("");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  };

  const handleLogout = () => {
    console.log("HandleLogout called");
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Обновление роли пользователя
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Поле поиска пользователей */}
          <TextField
            label="Поиск по почте"
            value={searchQuery}
            onChange={handleSearch}
            fullWidth
            placeholder="Введите почту пользователя"
          />
          {/* Выбор пользователя */}
          <FormControl fullWidth>
            <InputLabel>Пользователь</InputLabel>
            <Select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              label="Пользователь"
              required
            >
              <MenuItem value="">
                <em>Выберите пользователя</em>
              </MenuItem>
              {Array.isArray(filteredUsers) &&
                filteredUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.email} ({user.name || "Без имени"})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {/* Выбор роли */}
          <FormControl fullWidth>
            <InputLabel>Роль</InputLabel>
            <Select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              label="Роль"
              required
            >
              <MenuItem value="">
                <em>Выберите роль</em>
              </MenuItem>
              <MenuItem value={1}>Администратор</MenuItem>
              <MenuItem value={2}>Преподаватель</MenuItem>
              <MenuItem value={3}>Студент</MenuItem>
            </Select>
          </FormControl>
          {/* Кнопка отправки */}
          <Button type="submit" variant="contained" color="primary">
            Обновить роль
          </Button>
        </Box>
        {/* Сообщение об успехе */}
        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {/* Сообщение об ошибке */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Container>
    </>
  );
}