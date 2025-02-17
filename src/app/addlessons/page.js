"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import jwtDecode from "jwt-decode";
export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [courseId, setCourseId] = useState("");
  const [editingLesson, setEditingLesson] = useState(null);


     const token = localStorage.getItem("token");
    
      console.log('2 userTokenINITZ token=', token);
     
      let decodedToken = jwtDecode(token);
       console.log('3 getUsersPosts decoded=', decodedToken.username);
    
      if (!token) {
        // Handle the case where the token is not available or invalid
        console.error("Token not available");
        return;
      }
  
  useEffect(() => {
    fetchLessons();
    fetchCourses();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/lessons");
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке курсов:", error);
    }
  };

  const createLesson = async () => {
    if (!courseId) {
      alert("Выберите курс!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/lessons", {
        title,
        content,
        course_id: courseId,
      }, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', 
        },
    });
      
      setLessons([...lessons, response.data]);
      setTitle("");
      setContent("");
      setCourseId("");
    } catch (error) {
      console.error("Ошибка при создании урока:", error);
    }
  };

  const updateLesson = async (id) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/lessons/${id}`, {
        title,
        content,
        course_id: courseId,
      }, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', 
        },
    });
      setLessons(lessons.map((lesson) => (lesson.id === id ? response.data : lesson)));
      setEditingLesson(null);
      setTitle("");
      setContent("");
      setCourseId("");
    } catch (error) {
      console.error("Ошибка при обновлении урока:", error);
    }
  };

  const deleteLesson = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/lessons/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', 
        },
    });
      setLessons(lessons.filter((lesson) => lesson.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении урока:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: "center" }}>
        Управление уроками
      </Typography>

      {/* Форма добавления/редактирования */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">
          {editingLesson ? "Редактировать урок" : "Создать новый урок"}
        </Typography>
        <TextField
          fullWidth
          label="Название урока"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Содержание урока"
          multiline
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mt: 2 }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Выберите курс</InputLabel>
          <Select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={editingLesson ? () => updateLesson(editingLesson) : createLesson}
        >
          {editingLesson ? "Обновить урок" : "Добавить урок"}
        </Button>
      </Paper>

      {/* Список уроков */}
      <List>
        {lessons.map((lesson) => (
          <Paper key={lesson.id} elevation={3} sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText
                primary={lesson.title}
                secondary={`Курс: ${
                  courses.find((course) => course.id === lesson.course_id)?.title || "Неизвестно"
                }\n${lesson.content}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  color="primary"
                  onClick={() => {
                    setEditingLesson(lesson.id);
                    setTitle(lesson.title);
                    setContent(lesson.content);
                    setCourseId(lesson.course_id);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  color="error"
                  onClick={() => deleteLesson(lesson.id)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Container>
  );
}
