"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
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
  List as MuiList,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import jwtDecode from "jwt-decode";

// Начальные данные для Editor.js
const DEFAULT_INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      id: "default-paragraph",
      type: "paragraph",
      data: {
        text: "Начните создавать урок здесь...",
      },
    },
    {
      id: "default-header",
      type: "header",
      data: {
        text: "Заголовок урока",
        level: 2,
      },
    },
    {
      id: "default-list",
      type: "list",
      data: {
        style: "unordered",
        items: ["Пункт 1", "Пункт 2", "Пункт 3"],
      },
    },
  ],
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null); // Содержимое Editor.js
  const [courseId, setCourseId] = useState("");
  const [editingLesson, setEditingLesson] = useState(null);
  const token = localStorage.getItem("token");
  const editorInstance = useRef(null);

  if (!token) {
    console.error("Token not available");
    return <Typography>Токен авторизации отсутствует!</Typography>;
  }

  useEffect(() => {
    fetchLessons();
    fetchCourses();

    // Инициализация Editor.js при монтировании компонента
    if (!editorInstance.current) {
      initEditor();
    }

    return () => {
      // Очистка экземпляра Editor.js при размонтировании
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
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

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs", // ID контейнера для редактора
      autofocus: true,
      data: content || DEFAULT_INITIAL_DATA, // Используем начальные данные или текущее содержимое
      onChange: async () => {
        const updatedContent = await editor.saver.save(); // Получаем текущее содержимое
        setContent(updatedContent);
      },
      tools: {
        header: Header,
        list: List,
        quote: Quote,
        table: Table,
      },
    });
    editorInstance.current = editor;
  };

  const createLesson = async () => {
    if (!courseId) {
      alert("Выберите курс!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:4000/api/lessons",
        {
          title,
          content: JSON.stringify(content), // Преобразуем содержимое в JSON
          course_id: courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLessons([...lessons, response.data]);
      setTitle("");
      setContent(null);
      setCourseId("");
      if (editorInstance.current) {
        editorInstance.current.clear(); // Очищаем редактор
      }
    } catch (error) {
      console.error("Ошибка при создании урока:", error);
    }
  };

  const updateLesson = async () => {
    if (!editingLesson) return;

    try {
      const response = await axios.put(
        `http://localhost:4000/api/lessons/${editingLesson}`,
        {
          title,
          content: JSON.stringify(content), // Преобразуем содержимое в JSON
          course_id: courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLessons(lessons.map((lesson) => (lesson.id === editingLesson ? response.data : lesson)));
      setEditingLesson(null);
      setTitle("");
      setContent(null);
      setCourseId("");
      if (editorInstance.current) {
        editorInstance.current.clear(); // Очищаем редактор
      }
    } catch (error) {
      console.error("Ошибка при обновлении урока:", error);
    }
  };

  const deleteLesson = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/lessons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Урок успешно удален:", response.data);
      setLessons(lessons.filter((lesson) => lesson.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении урока:", error.response?.data || error.message);
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
        {/* Editor.js */}
        <Box id="editorjs" sx={{ mt: 2, border: "1px solid #ccc", minHeight: "200px" }} />
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
          onClick={editingLesson ? updateLesson : createLesson}
        >
          {editingLesson ? "Обновить урок" : "Добавить урок"}
        </Button>
      </Paper>
      {/* Список уроков */}
      <MuiList>
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
                    const parsedContent = lesson.content ? JSON.parse(lesson.content) : null;
                    setEditingLesson(Number(lesson.id));
                    setTitle(lesson.title);
                    setContent(parsedContent);
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
      </MuiList>
    </Container>
  );
}