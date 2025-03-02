"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

export default function UserAnalytics({ users, courses }) {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Функция для загрузки данных о прогрессе всех пользователей по всем курсам
  const fetchAllProgresses = async () => {
    try {
      const allProgressData = [];

      for (const user of users) {
        for (const course of courses) {
          try {
            const response = await axios.get(
              `http://localhost:4000/api/course/progress/${user.id}/${course.id}`
            );
            const { lessons, course_progress } = response.data;

            allProgressData.push({
              user_name: user.name,
              course_name: course.title,
              course_progress: course_progress,
              completed_lessons: lessons.filter((lesson) => lesson.status === "completed").length,
              total_lessons: lessons.length,
            });
          } catch (error) {
            console.error(`Ошибка при загрузке прогресса для пользователя ${user.name} и курса ${course.title}:`, error);
          }
        }
      }

      setProgressData(allProgressData);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке данных о прогрессе:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProgresses();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Аналитика по пользователям и курсам
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Пользователь</TableCell>
              <TableCell>Курс</TableCell>
              <TableCell>Прогресс (%)</TableCell>
              <TableCell>Завершено уроков</TableCell>
              <TableCell>Всего уроков</TableCell>
              <TableCell>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {progressData.length > 0 ? (
              progressData.map((progress, index) => (
                <TableRow key={index}>
                  <TableCell>{progress.user_name || "Неизвестный пользователь"}</TableCell>
                  <TableCell>{progress.course_name || "Неизвестный курс"}</TableCell>
                  <TableCell>{progress.course_progress || "0"}%</TableCell>
                  <TableCell>{progress.completed_lessons}</TableCell>
                  <TableCell>{progress.total_lessons}</TableCell>
                  <TableCell>
                    {parseFloat(progress.course_progress) === 100 ? (
                      <span style={{ color: "green" }}>Завершен</span>
                    ) : (
                      <span style={{ color: "orange" }}>В процессе</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Нет данных о прогрессе пользователей
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}