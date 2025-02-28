"use client";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesAction, logoutAction } from "@/store/slices/authSlice";
import { Card, CardContent, CardActions, Button, Typography, Container, Grid, CircularProgress, Box } from "@mui/material";
import Link from "next/link";
import TopMenu from "@/components/topmenu";
import axios from "axios";
export default function Courses() {
  const dispatch = useDispatch();
  const { courses, loadingCourses, coursesError } = useSelector((state) => state.auth);

  const isAuth = useSelector((state) => state.auth.isAuth);
  const userData = useSelector((state) => state.auth.currentUser);
  const [userInfo, setUserInfo] = useState(null);
const [progresses, setProgresses] = useState();
  const token = localStorage.getItem("token");

  // Функция для обработки выхода из системы
  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!isAuth && !token) {
      window.location.href = "/login"; // Перенаправляем на страницу входа, если нет авторизации
    }
    dispatch(getAllCoursesAction());
    fetchUserInfo();
   
  
  }, [dispatch, isAuth, token]);


  const fetchUserInfo = async () => {
    console.log('fetchUserInfo started!')
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

  
//   useEffect(() => {
    
    
//  }, []);
 
  const fetchAllProgresses = async (userInfo, courses) => {
    console.log('fetchAllPRogresses -  ',userInfo,courses)
    try {
      const response = await axios.get(`http://localhost:4000/api/course/progress/${userInfo.id}/${courses[0].id}`);
      const data = response.data.course_progress; // Предполагаем, что сервер возвращает { lessons: [...] }

      setProgresses(data); // Сохраняем массив в состояние
    } catch (error) {
      console.error("Ошибка при получении прогресса:", error);
    }
  };

  useEffect(() => {
    if (userInfo && courses && courses.length > 0) {
      // Вызываем fetchAllProgresses только если userInfo и courses загружены
      fetchAllProgresses(userInfo, courses);
    }
  }, [userInfo, courses]);
 
  if (loadingCourses) {
    
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
        
      </Box>
    );
  }

  if (coursesError) {
    return <Typography variant="h6" color="error">Ошибка: {coursesError}</Typography>;
  }




  // console.log('UserINFO= ',userInfo)


 
  


  return (
    <>
      {/* Верхнее меню */}
      <TopMenu userInfo={userInfo} handleLogout={handleLogout} />

      {/* Основной контейнер */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}>
          Доступные курсы
        </Typography>
        {courses.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center">
            Нет доступных курсов.
          </Typography>
        ) : (
          <Grid container spacing={4}>
           
            {courses.map((course) => (
              <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" component="div" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="h5" color="text.secondary">
                      {course.description || "Описание отсутствует."}
                    </Typography>
                 
                  
                  <Typography variant="h8" color="text.secondary">
                      Прогресс прохождения {progresses|| ""}%
                  </Typography>
                  </CardContent>
                  <CardActions>
                 
                    <Button
                      component={Link}
                      href={`/courses/${course.id}`}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Перейти к курсу
                    </Button>
                   
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}