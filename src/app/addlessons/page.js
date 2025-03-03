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
import { useSelector, useDispatch } from "react-redux";
import TopMenu from "@/components/topmenu";
import { getUserInfoAction, logoutAction } from "@/store/slices/authSlice";
import RawTool from "@editorjs/raw";
import SimpleImage from "@editorjs/simple-image";
import Checklist from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import "../style/base.css"
export default function LessonsPage() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  // const userInfo = useSelector((state) => state.auth.currentUser);
  

  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [courseId, setCourseId] = useState("");
  const [editingLesson, setEditingLesson] = useState(null);
  const editorInstance = useRef(null);
const [userInfo, setUserInfo] = useState(null); // Инициализируем как null
  if (!token) {
    console.error("Token not available");
    return <Typography>Токен отсутствует. Пожалуйста, войдите в систему.</Typography>;
  }

  useEffect(() => {
    fetchLessons();
    fetchCourses();
 
    fetchUserInfo()

    if (editorInstance.current) {
      try {
        editorInstance.current.destroy();
      } catch (error) {
        console.warn("Ошибка при уничтожении предыдущего экземпляра Editor.js:", error);
      }
      editorInstance.current = null;
    }

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
          raw: RawTool,
          image: SimpleImage,
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                coub: true,
              },
            },
          },
          quote: Quote,
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },
        },
      
      });
      editorInstance.current = editor;
    }

    return () => {
     if (editorInstance.current) {
        try {
          editorInstance.current.destroy();
        } catch (error) {
          console.warn("Ошибка при уничтожении экземпляра Editor.js:", error);
        }
        editorInstance.current = null;
      }
    };
  }, []);

  const fetchUserInfo = async () => {
    // console.log('fetchUserInfo started!')
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:4000/api/auth/getAuthentificatedUserInfo",
      {headers: {
        'Authorization': `Bearer ${token}`,
      }
      },);
      setUserInfo(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
      
    }
  };
  useEffect(() => {
    if (editingLesson && editorInstance.current) {
      const lesson = lessons.find((l) => l.id === editingLesson);
      if (lesson && lesson.content) {
        editorInstance.current.render(JSON.parse(lesson.content));
      }
    }
  }, [editingLesson, lessons]);

  const fetchLessons = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/lessons", {
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
      const response = await axios.get("http://localhost:4000/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке курсов:", error);
      alert("Ошибка при загрузке курсов: " + error.message);
    }
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
      setTitle("");
      setContent(null);
      setCourseId("");
      if (editorInstance.current) editorInstance.current.clear();
    } catch (error) {
      console.error("Ошибка при создании урока:", error);
      alert("Ошибка при создании урока: " + error.message);
    }
  };

  const updateLesson = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/lessons/${id}`,
        {
          title,
          content: JSON.stringify(content),
          courseId: Number(courseId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLessons(lessons.map((lesson) => (lesson.id === id ? response.data : lesson)));
      setEditingLesson(null);
      setTitle("");
      setContent(null);
      setCourseId("");
      if (editorInstance.current) editorInstance.current.clear();
    } catch (error) {
      console.error("Ошибка при обновлении урока:", error);
      alert("Ошибка при обновлении урока: " + error.message);
    }
  };

  const deleteLesson = async (id) => {
    console.log('delete id= ', id);
    try {
      const response = await axios.delete(`http://localhost:4000/api/lessons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 204) {
        setLessons(lessons.filter((lesson) => lesson.id !== id));
        console.log('Lesson deleted successfully, id:', id);
      }
    } catch (error) {
      console.error("Ошибка при удалении урока:", error.response ? error.response.data : error.message);
      alert("Ошибка при удалении урока: " + (error.response?.data?.error || error.message));
    }
  };

  const handleLogout = () => {
    console.log('HandleLogout called');
    dispatch(logoutAction());
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: "center" }}>
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
          <Box id="editorjs" sx={{ mt: 2, border: "1px solid #ccc", minHeight: "10px" }} />
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
                      setContent(JSON.parse(lesson.content));
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