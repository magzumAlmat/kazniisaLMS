"use client";
import { useDispatch, useSelector } from "react-redux";
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
import jwtDecode from "jwt-decode";
import { getUserInfoAction } from "@/store/slices/authSlice";
import TopMenu from "@/components/topmenu";
export default function CoursesPage() {
 const [userInfo, setUserInfo] = useState(null); // Инициализируем как null
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingCourse, setEditingCourse] = useState(null); // ID редактируемого курса
  // const userInfo  = useSelector((state) => state.auth.currentUser);
  const dispatch=useDispatch()
  console.log('userInfo from slice= ',userInfo)
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
    fetchCourses();
    fetchUserInfo();
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

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке курсов:", error);
    }
  };

  const createCourse = async () => {
    const token = localStorage.getItem("token");
    console.log('token= ', token);

    try {
        const response = await axios.post(
            "http://localhost:4000/api/courses",
            {
                title,
                description,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', // Устанавливаем тип контента как JSON
                },
            }
        );

        // Если запрос успешен, добавляем новый курс в список
        setCourses([...courses, response.data]);
        setTitle("");
        setDescription("");

        // Выводим сообщение об успехе
        alert("Курс успешно создан!");
    } catch (error) {
        console.error("Ошибка при создании курса:", error);

        // Проверяем статус ошибки
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                alert("Ошибка: Необходимо авторизоваться.");
            } else if (status === 403) {
                alert("Ошибка: У вас нет прав для создания курса.");
            } else if (status === 400) {
                alert(`Ошибка: ${data.message || "Некорректные данные."}`);
            } else {
                alert("Произошла ошибка. Попробуйте позже.");
            }
        } else {
            alert("Не удалось подключиться к серверу. Проверьте соединение.");
        }
    }
};

  const updateCourse = async (id) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/courses/${id}`, {
        title,
        description,
      },
      {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json', 
          },
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
      await axios.delete(`http://localhost:4000/api/courses/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                   
                },
            })
      setCourses(courses.filter((course) => course.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении курса:", error);
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
    </>
  );
}
