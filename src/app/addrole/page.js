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
import { useRouter } from 'next/navigation';


export default function UpdateUserRolePage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]); // Список всех пользователей
  const [filteredUsers, setFilteredUsers] = useState([]); // Отфильтрованный список пользователей
  const [searchQuery, setSearchQuery] = useState(""); // Поисковый запрос
  const token = localStorage.getItem("token");
  const [userInfo, setUserInfo] = useState(null); // Инициализируем как null
  // Загрузка пользователей при монтировании компонента
  const host=process.env.NEXT_PUBLIC_HOST
  const dispatch=useDispatch()
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${host}/api/getallusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Проверяем, что данные пришли в ожидаемом формате
        if (response.data && Array.isArray(response.data.users)) {
          const usersData = response.data.users; // Извлекаем массив пользователей
          console.log("Data from API:", usersData);
          setUsers(usersData); // Сохраняем в состояние
          setFilteredUsers(usersData); // Изначально отображаем всех пользователей
        } else {
          console.error("Неверный формат данных:", response.data);
        }
      } catch (err) {
        console.error("Ошибка при загрузке пользователей:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    
    fetchUserInfo()
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке информации о пользователе:', err);
      if (err.response && err.response.status === 401) {
        // Перенаправляем на страницу логина при 401
        router.push('/login');
      }
    }
  };
  // Фильтрация пользователей по почте
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!Array.isArray(users)) {
      console.error("Users is not an array");
      return;
    }

    const filtered = users.filter((user) =>
      user.email.toLowerCase().includes(query)
    );
    console.log("Filtered users:", filtered); // Логируем отфильтрованных пользователей
    setFilteredUsers(filtered);
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    console.log('Выбрана роль= ',roleId)
    e.preventDefault();
    try {
      const response = await axios.put(`${host}/api/users/${userId}/role`, {
        roleId: roleId,
      },
      {headers: {
        Authorization: `Bearer ${token}`,
      }}
    );
      if (response.status === 200) {
        setMessage(response.data.message);
        setError("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Произошла ошибка");
      setMessage("");
    }
  };


  const handleLogout = () => {
    console.log('HandleLogout called');
    dispatch(logoutAction());
    localStorage.removeItem('token');
    router.push('/login');
  };


  return (
    <>
    <TopMenu handleLogout={handleLogout}  userInfo={userInfo} />

    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Обновление роли пользователя
      </Typography>
      {/* Форма */}
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