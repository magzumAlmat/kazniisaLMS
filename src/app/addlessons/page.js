"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
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
import { useSelector, useDispatch } from "react-redux";
import TopMenu from "@/components/topmenu";
import { logoutAction } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import "../style/base.css";

export default function LessonsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [courseId, setCourseId] = useState("");
  const [editingLesson, setEditingLesson] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const editorInstance = useRef(null);
  const host=process.env.NEXT_PUBLIC_HOST
  // Получение токена на стороне клиента
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) {
      router.push("/login");
    }
  }, [router]);

  // Инициализация данных
  useEffect(() => {
    if (token) {
      fetchLessons();
      fetchCourses();
      fetchUserInfo();
    }
  }, [token]);

  // Инициализация EditorJS
  useEffect(() => {
    if (!token) return;

    if (!editorInstance.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        autofocus: true,
        data: content || { blocks: [] },
        onChange: async () => {
          const updatedContent = await editor.saver.save();
          setContent(updatedContent);
        },
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3, 4],
              defaultLevel: 1,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: { defaultStyle: "unordered" },
          },
        },
      });
      editorInstance.current = editor;
    }

    return () => {
      if (editorInstance.current) {
        try {
          editorInstance.current.destroy();
          editorInstance.current = null;
        } catch (error) {
          console.warn("Ошибка при уничтожении Editor.js:", error);
        }
      }
    };
  }, [token]);

  // Обновление содержимого при редактировании урока
  useEffect(() => {
    if (editingLesson && editorInstance.current) {
      const lesson = lessons.find((l) => l.id === editingLesson);
      if (lesson && lesson.content) {
        try {
          const parsedContent = JSON.parse(lesson.content);
          editorInstance.current.render(parsedContent);
        } catch (error) {
          console.error("Ошибка при парсинге содержимого урока:", error);
        }
      }
    }
  }, [editingLesson, lessons]);

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${host}/api/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
      alert("Ошибка при загрузке уроков: " + error.message);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${host}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке курсов:", error);
      alert("Ошибка при загрузке курсов: " + error.message);
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

  const createLesson = async () => {
    if (!courseId) {
      alert("Выберите курс!");
      return;
    }
    try {
      const response = await axios.post(
        `${host}/api/lessons`,
        {
          title,
          content: JSON.stringify(content),
          course_id: Number(courseId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLessons([...lessons, response.data]);
      resetForm();
    } catch (error) {
      console.error("Ошибка при создании урока:", error);
      alert("Ошибка при создании урока: " + error.message);
    }
  };

  const updateLesson = async (id) => {
    try {
      const response = await axios.put(
        `${host}/api/lessons/${id}`,
        {
          title,
          content: JSON.stringify(content),
          course_id: Number(courseId), // Исправлено: course_id вместо courseId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLessons(lessons.map((lesson) => (lesson.id === id ? response.data : lesson)));
      resetForm();
    } catch (error) {
      console.error("Ошибка при обновлении урока:", error);
      alert("Ошибка при обновлении урока: " + error.message);
    }
  };

  const deleteLesson = async (id) => {
    try {
      const response = await axios.delete(`${host}/api/lessons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 204) {
        setLessons(lessons.filter((lesson) => lesson.id !== id));
      }
    } catch (error) {
      console.error("Ошибка при удалении урока:", error);
      alert("Ошибка при удалении урока: " + (error.response?.data?.error || error.message));
    }
  };

  const resetForm = () => {
    setEditingLesson(null);
    setTitle("");
    setContent(null);
    setCourseId("");
    if (editorInstance.current) {
      editorInstance.current.clear();
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!token) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>
        Токен отсутствует. Пожалуйста, войдите в систему.
      </Typography>
    );
  }

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
          Управление уроками
        </Typography>
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
            onClick={editingLesson ? () => updateLesson(editingLesson) : createLesson}
          >
            {editingLesson ? "Обновить урок" : "Добавить урок"}
          </Button>
        </Paper>
        <MuiList>
          {lessons.map((lesson) => (
            <Paper key={lesson.id} elevation={3} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemText
                  primary={lesson.title}
                  secondary={`Курс: ${
                    courses.find((course) => course.id === lesson.course_id)?.title || "Неизвестно"
                  }`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    color="primary"
                    onClick={() => {
                      setEditingLesson(lesson.id);
                      setTitle(lesson.title);
                      setContent(lesson.content ? JSON.parse(lesson.content) : null);
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
    </>
  );
}