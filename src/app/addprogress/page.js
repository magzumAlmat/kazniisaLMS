"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function AddProgressPage() {
  // Состояния для полей формы
  const [formData, setFormData] = useState({
    user_id: "",
    lesson_id: "",
    status: "not_started", // Значение по умолчанию
    progress_percentage: 0,
  });

  // Состояние для отображения сообщений об успехе или ошибке
  const [message, setMessage] = useState("");

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Отправляем POST-запрос на сервер
      const response = await axios.post("http://localhost:4000/api/progresses", formData);
      console.log("Progress created:", response.data);

      // Очищаем форму и показываем сообщение об успехе
      setFormData({
        user_id: "",
        lesson_id: "",
        status: "not_started",
        progress_percentage: 0,
      });
      setMessage("Прогресс успешно добавлен!");
    } catch (error) {
      console.error("Ошибка при добавлении прогресса:", error);
      setMessage("Ошибка: " + error.response?.data?.error || "Не удалось добавить прогресс.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Добавить прогресс
        </Typography>

        {/* Форма для добавления прогресса */}
        <form onSubmit={handleSubmit}>
          {/* Поле user_id */}
          <TextField
            fullWidth
            label="User ID"
            name="user_id"
            type="number"
            value={formData.user_id}
            onChange={handleChange}
            required
            margin="normal"
          />

          {/* Поле lesson_id */}
          <TextField
            fullWidth
            label="Lesson ID"
            name="lesson_id"
            type="number"
            value={formData.lesson_id}
            onChange={handleChange}
            required
            margin="normal"
          />

          {/* Выбор статуса */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Статус</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Статус"
            >
              <MenuItem value="not_started">Не начато</MenuItem>
              <MenuItem value="in_progress">В процессе</MenuItem>
              <MenuItem value="completed">Завершено</MenuItem>
            </Select>
          </FormControl>

          {/* Поле progress_percentage */}
          <TextField
            fullWidth
            label="Прогресс (%)"
            name="progress_percentage"
            type="number"
            value={formData.progress_percentage}
            onChange={handleChange}
            required
            margin="normal"
          />

          {/* Кнопка отправки */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Добавить прогресс
          </Button>
        </form>

        {/* Сообщение об успехе или ошибке */}
        {message && (
          <Box mt={2}>
            <Typography
              variant="body1"
              color={message.includes("успешно") ? "green" : "red"}
            >
              {message}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}