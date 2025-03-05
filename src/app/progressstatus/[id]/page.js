"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Box,
  Typography,
  List as MuiList,
  ListItem,
  ListItemText,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getAllCoursesAction, logoutAction } from "@/store/slices/authSlice";
import TopMenu from "@/components/topmenu";

export default function ProgressDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const token = localStorage.getItem("token");
  const [userInfo, setUserInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTestPassed, setIsTestPassed] = useState(false);
  const { courses } = useSelector((state) => state.auth);
  const host = process.env.NEXT_PUBLIC_HOST;

  // Загрузка данных пользователя и курсов
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const userResponse = await axios.get(`${host}/api/getallusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const foundUser = userResponse.data.users.find((u) => u.id === Number(id));
        if (!foundUser) {
          throw new Error("Пользователь не найден");
        }
        setUser(foundUser);

        // Выполняем действие без .unwrap()
        await dispatch(getAllCoursesAction());
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить данные пользователя или курсы");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [dispatch, token, id, router]);

  // Загрузка прогресса и начального состояния чекбокса
  useEffect(() => {
    if (user && courses.length) {
      const fetchProgress = async () => {
        setLoading(true);
        setError(null);
        const progressMap = {};

        try {
          const progressPromises = courses.map((course) =>
            axios
              .get(`${host}/api/course/progress/${user.id}/${course.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((response) => ({
                courseId: course.id,
                data: response.data,
              }))
              .catch(() => ({
                courseId: course.id,
                data: { lessons: [], course_progress: 0 },
              }))
          );

          const results = await Promise.all(progressPromises);
          results.forEach(({ courseId, data }) => {
            progressMap[courseId] = data.course_progress;
          });

          setProgressData(progressMap);

          const hasFinished = results.some(({ data }) =>
            data.lessons.some((lesson) => lesson.isfinished === "yes")
          );
          setIsTestPassed(hasFinished);
        } catch (err) {
          console.error("Ошибка при загрузке прогресса:", err);
          setError("Ошибка при загрузке данных прогресса");
        } finally {
          setLoading(false);
        }
      };

      fetchProgress();
      fetchUserInfo();
    }
  }, [user, courses, token]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке информации о пользователе:", error);
      if (error.response && error.response.status === 401) {
        router.push("/login");
      }
    }
  };

  const handleCheckboxChange = async (event) => {
    const checked = event.target.checked;
    setIsTestPassed(checked);

    try {
      await axios.put(
        `${host}/api/course/progress/update-finished/${user.id}`,
        { isfinished: checked ? "yes" : "no" },
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Ошибка при обновлении isfinished:", error);
      setError("Не удалось обновить статус теста");
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
        <Typography>Loading data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography>Пользователь не найден</Typography>
      </Box>
    );
  }

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Прогресс пользователя: {user.name} {user.lastname} ({user.email})
        </Typography>
        <MuiList>
          {courses.map((course) => (
            <ListItem key={course.id}>
              <ListItemText
                primary={course.title}
                secondary={`Прогресс: ${progressData[course.id] ?? 0}%`}
              />
            </ListItem>
          ))}
        </MuiList>
        <FormControlLabel
          control={
            <Checkbox
              checked={isTestPassed}
              onChange={handleCheckboxChange}
              color="primary"
            />
          }
          label="Пройден ли тест на сайте Building Smart?"
        />
<br />
        <button>
          сформировать отчет
        </button>
      </Box>
    </>
  );
}