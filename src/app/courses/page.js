"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesAction, logoutAction } from "@/store/slices/authSlice";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import Link from "next/link";
import TopMenu from "@/components/topmenu";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Courses() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { courses, loadingCourses, coursesError } = useSelector((state) => state.auth);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const [userInfo, setUserInfo] = useState(null);
  const [progresses, setProgresses] = useState({});
  const [token, setToken] = useState(null); // Инициализируем токен как null
  const host=process.env.NEXT_PUBLIC_HOST
  // Получение токена на стороне клиента
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) {
      router.push("/login");
    }
  }, [router]);

  // Загрузка данных
  useEffect(() => {
    if (token) {
      dispatch(getAllCoursesAction());
      fetchUserInfo();
    }
  }, [token, dispatch]);

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

  const fetchAllProgresses = async (userId, courseId) => {
    try {
      const response = await axios.get(`${host}/api/course/progress/${userId}/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.course_progress;
      setProgresses((prev) => ({
        ...prev,
        [courseId]: data,
      }));
    } catch (error) {
      console.error("Ошибка при получении прогресса:", error);
    }
  };

  useEffect(() => {
    if (userInfo && courses && courses.length > 0 && token) {
      courses.forEach((course) => {
        fetchAllProgresses(userInfo.id, course.id);
      });
    }
  }, [userInfo, courses, token]);

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!token || loadingCourses) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (coursesError) {
    return (
      <Container sx={{ py: 2 }}>
        <Typography variant="h6" color="error" align="center">
          Ошибка: {coursesError}
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
      <Container
        sx={{
          py: { xs: 2, sm: 4 },
          px: { xs: 1, sm: 2 },
          minHeight: "calc(100vh - 64px)", // Учитываем высоту TopMenu
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            mb: { xs: 2, sm: 4 },
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          Доступные курсы
        </Typography>
        {courses.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center">
            Нет доступных курсов.
          </Typography>
        ) : (
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            justifyContent="center"
          >
            {courses.map((course) => (
              <Grid
                item
                key={course.id}
                xs={12} // Одна колонка на мобильных
                sm={6} // Две колонки на планшетах
                md={4} // Три колонки на десктопе
                lg={3} // Четыре колонки на больших экранах
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.02)" },
                    boxShadow: 3,
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      gutterBottom
                      sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    >
                      {course.description || "Описание отсутствует."}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      Прогресс: {progresses[course.id] || 0}%
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2 }}>
                    <Button
                      component={Link}
                      href={`/courses/${course.id}`}
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        py: { xs: 0.5, sm: 1 },
                      }}
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