"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingCourse, setEditingCourse] = useState(null); // ID редактируемого курса

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке курсов:", error);
    }
  };

  const createCourse = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/courses", {
        title,
        description,
      });
      setCourses([...courses, response.data]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Ошибка при создании курса:", error);
    }
  };

  const updateCourse = async (id) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/courses/${id}`, {
        title,
        description,
      });
      setCourses(courses.map((course) => (course.id === id ? response.data : course)));
      setEditingCourse(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Ошибка при обновлении курса:", error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/courses/${id}`);
      setCourses(courses.filter((course) => course.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении курса:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: "center" }}>
        Управление курсами
      </Typography>

      {/* Форма добавления/редактирования */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">
          {editingCourse ? "Редактировать курс" : "Создать новый курс"}
        </Typography>
        <TextField
          fullWidth
          label="Название курса"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Описание курса"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={editingCourse ? () => updateCourse(editingCourse) : createCourse}
        >
          {editingCourse ? "Обновить курс" : "Добавить курс"}
        </Button>
      </Paper>

      {/* Список курсов */}
      <List>
        {courses.map((course) => (
          <Paper key={course.id} elevation={3} sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText
                primary={course.title}
                secondary={course.description}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  color="primary"
                  onClick={() => {
                    setEditingCourse(course.id);
                    setTitle(course.title);
                    setDescription(course.description);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  color="error"
                  onClick={() => deleteCourse(course.id)}
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
