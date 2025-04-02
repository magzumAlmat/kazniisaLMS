"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
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
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import TopMenu from "../../components/topmenu";
import { logoutAction } from "../../store/slices/authSlice";
import { useRouter } from "next/navigation";

// Динамический импорт Editor.js и инструментов
const EditorJS = dynamic(() => import("@editorjs/editorjs").then((mod) => mod.default), { ssr: false });
const Header = dynamic(() => import("@editorjs/header").then((mod) => mod.default), { ssr: false });
const List = dynamic(() => import("@editorjs/list").then((mod) => mod.default), { ssr: false });
const ImageTool = dynamic(() => import("@editorjs/image").then((mod) => mod.default), { ssr: false });

export default function LessonsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState({ blocks: [] });
  const [courseId, setCourseId] = useState("");
  const [editingLesson, setEditingLesson] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const editorInstance = useRef(null);
  const host = process.env.NEXT_PUBLIC_HOST;

  // Функция загрузки изображения на сервер
  const uploadImageByFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name.split(".")[0]); // Имя без расширения

      const response = await fetch(`${host}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Ошибка загрузки изображения");
      }

      const result = await response.json();
      return {
        success: 1,
        file: {
          url: `${host}/${result.newFile.path}`,
        },
      };
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
      return {
        success: 0,
        message: "Ошибка загрузки изображения",
      };
    }
  };

  // Инициализация токена
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) router.push("/login");
  }, [router]);

  // Загрузка данных
  useEffect(() => {
    if (token) {
      fetchLessons();
      fetchCourses();
      fetchUserInfo();
    }
  }, [token]);

  // Инициализация Editor.js
  useEffect(() => {
    if (!token) return;

    const initEditor = async () => {
      try {
        const [EditorJS, Header, List, ImageTool] = await Promise.all([
          import("@editorjs/editorjs").then((mod) => mod.default),
          import("@editorjs/header").then((mod) => mod.default),
          import("@editorjs/list").then((mod) => mod.default),
          import("@editorjs/image").then((mod) => mod.default),
        ]);

        // Уничтожаем предыдущий экземпляр, если он существует
        if (editorInstance.current?.destroy) {
          await editorInstance.current.destroy();
        }

        const editor = new EditorJS({
          holder: "editorjs-container",
          tools: {
            header: {
              class: Header,
              config: { levels: [2, 3], defaultLevel: 2, placeholder: "Введите заголовок" },
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  uploadByFile: uploadImageByFile, // Загрузка через файл
                },
              },
            },
          },
          placeholder: "Введите содержимое урока...",
          data: content, // Используем текущее состояние content
          onChange: async () => {
            const savedData = await editor.save();
            setContent(savedData);
          },
          logLevel: "ERROR",
        });

        editorInstance.current = editor;
      } catch (error) {
        console.error("Ошибка инициализации редактора:", error);
      }
    };

    initEditor();

    return () => {
      if (editorInstance.current?.destroy) {
        editorInstance.current.destroy();
      }
    };
  }, [token]);

  // Обновление содержимого редактора при редактировании урока
  useEffect(() => {
    if (!editorInstance.current || !editingLesson) return;

    const loadLessonData = async () => {
      const currentLesson = lessons.find((l) => l.id === editingLesson);
      const parsedContent = currentLesson?.content
        ? JSON.parse(currentLesson.content)
        : { blocks: [] };

      setContent(parsedContent); // Обновляем состояние content
      await editorInstance.current.render(parsedContent); // Рендерим данные в редактор
    };

    loadLessonData();
  }, [editingLesson, lessons]);

  // Загрузка уроков
  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${host}/api/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка загрузки уроков:", error);
    }
  };

  // Загрузка курсов
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${host}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Ошибка загрузки курсов:", error);
    }
  };

  // Загрузка данных пользователя
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

  // Начать редактирование урока
  const handleEdit = (lessonId) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (lesson) {
      setTitle(lesson.title);
      setCourseId(lesson.course_id.toString());
      setContent(lesson.content ? JSON.parse(lesson.content) : { blocks: [] });
      setEditingLesson(lessonId);
    }
  };

  // Удаление урока
  const handleDelete = async (lessonId) => {
    if (!window.confirm("Удалить урок?")) return;

    try {
      setIsLoading(true);
      await axios.delete(`${host}/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(lessons.filter((l) => l.id !== lessonId));
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка удаления урока:", error);
      setIsLoading(false);
    }
  };

  // Сохранение урока
  const handleSave = async () => {
    if (!editorInstance.current) return;
    if (!title || !courseId) return alert("Заполните все поля!");

    try {
      const savedContent = await editorInstance.current.save();
      setIsLoading(true);
      const requestData = {
        title,
        content: JSON.stringify(savedContent), // Используем свежие данные из редактора
        course_id: Number(courseId),
      };

      if (editingLesson) {
        const response = await axios.put(
          `${host}/api/lessons/${editingLesson}`,
          requestData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLessons(lessons.map((l) => (l.id === editingLesson ? response.data : l)));
      } else {
        const response = await axios.post(`${host}/api/lessons`, requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLessons([...lessons, response.data]);
      }

      resetForm();
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка сохранения урока:", error);
      setIsLoading(false);
    }
  };

  // Сброс формы
  const resetForm = () => {
    setTitle("");
    setContent({ blocks: [] });
    setCourseId("");
    setEditingLesson(null);

    if (editorInstance.current?.render) {
      editorInstance.current.render({ blocks: [] });
    }
  };

  // Логаут
  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Удаляем кнопку, так как загрузка изображения теперь через тулбар Editor.js
  // const handleImageUpload = () => {
  //   const input = document.createElement('input');
  //   input.type = 'file';
  //   input.accept = 'image/*';
  //   input.onchange = async (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       const result = await uploadImageByFile(file);
  //       if (result.success === 1 && editorInstance.current) {
  //         editorInstance.current.blocks.insert('image', {
  //           file: { url: result.file.url },
  //           caption: '',
  //           withBorder: false,
  //           stretched: false,
  //           withBackground: false,
  //         });
  //       }
  //     }
  //   };
  //   input.click();
  // };

  if (!token) return <Typography>Токен отсутствует</Typography>;

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {editingLesson ? "Редактировать урок" : "Создать урок"}
          </Typography>

          <TextField
            fullWidth
            label="Название урока"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Выберите курс</InputLabel>
            <Select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div id="editorjs-container" style={{ minHeight: "300px", border: "1px solid #ccc", borderRadius: "4px", padding: "10px" }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="outlined" onClick={resetForm}>
              Очистить
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isLoading || !title || !courseId}
              startIcon={isLoading && <CircularProgress size={20} />}
            >
              {editingLesson ? "Обновить" : "Создать"}
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Список уроков
          </Typography>
          <MuiList>
            {lessons.map((lesson) => (
              <ListItem
                key={lesson.id}
                secondaryAction={
                  <>
                    <IconButton edge="end" onClick={() => handleEdit(lesson.id)} sx={{ mr: 1 }}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(lesson.id)} color="error">
                      <Delete />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={lesson.title}
                  secondary={`Курс: ${courses.find((c) => c.id === lesson.course_id)?.title || "Неизвестный курс"}`}
                />
              </ListItem>
            ))}
          </MuiList>
        </Paper>
      </Container>
    </>
  );
}