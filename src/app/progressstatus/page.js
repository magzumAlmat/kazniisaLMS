'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import TopMenu from '@/components/topmenu';
import { logoutAction, getAllCoursesAction } from '@/store/slices/authSlice';

export default function UserProgressPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = localStorage.getItem('token');
  const [userInfo, setUserInfo] = useState(null); // Инициализируем как null
  console.log('Token:', token);

  const [users, setUsers] = useState([]);
  console.log('Initial Users:', users);

  const [progressData, setProgressData] = useState({});
  console.log('Initial ProgressData:', progressData);

  const [loading, setLoading] = useState(false);
  console.log('Loading:', loading);

  const [error, setError] = useState(null);
  console.log('Error:', error);

  const { courses } = useSelector((state) => state.auth);
  console.log('Courses from Redux:', courses);

  // Загрузка пользователей и курсов
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log('Fetching users...');
        const usersResponse = await axios.get('http://localhost:4000/api/getallusers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Users Response:', usersResponse.data);
        setUsers(usersResponse.data.users);

        console.log('Dispatching getAllCoursesAction...');
        dispatch(getAllCoursesAction());
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить пользователей или курсы');
      }
    };

    fetchInitialData();
  }, [dispatch, token]);

  // Итеративная загрузка прогресса
  useEffect(() => {
    if (users.length && courses.length) {
      console.log('Users in second useEffect:', users);
      console.log('Courses in second useEffect:', courses);

      const fetchAllProgress = async () => {
        setLoading(true);
        console.log('Set Loading to true');

        setError(null);
        const progressMap = {};
        console.log('Initial ProgressMap:', progressMap);

        try {
          console.log('Starting progress fetch for all users and courses...');
          const progressPromises = users.flatMap((user) =>
            courses.map((course) => {
              console.log(`Fetching progress for user ${user.id} and course ${course.id}`);
              return axios
                .get(`http://localhost:4000/api/course/progress/${user.id}/${course.id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                  console.log(`Progress Response for user ${user.id}, course ${course.id}:`, response.data);
                  return {
                    userId: user.id,
                    courseId: course.id,
                    data: response.data,
                  };
                })
                .catch((err) => {
                  console.error(`Error fetching progress for user ${user.id}, course ${course.id}:`, err);
                  return {
                    userId: user.id,
                    courseId: course.id,
                    data: { lessons: [], course_progress: 0 },
                  };
                });
            })
          );

          const results = await Promise.all(progressPromises);
          console.log('All Progress Results:', results);

          results.forEach(({ userId, courseId, data }) => {
            if (!progressMap[userId]) {
              progressMap[userId] = {};
            }
            progressMap[userId][courseId] = data.course_progress;
            console.log(`Updated progressMap for user ${userId}, course ${courseId}:`, progressMap[userId][courseId]);
          });

          console.log('Final ProgressMap:', progressMap);
          setProgressData(progressMap);
          console.log('ProgressData after set:', progressData);
        } catch (err) {
          console.error('Ошибка при загрузке прогресса:', err);
          setError('Ошибка при загрузке данных прогресса');
        } finally {
          setLoading(false);
          console.log('Set Loading to false');
        }
      };

      fetchAllProgress();
      fetchUserInfo();
    }
  }, [users, courses, token]);

  const fetchUserInfo = async () => {
    // console.log('fetchUserInfo started!')
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
  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem('token');
    router.push('/login');
  };

  console.log('Rendering... Users:', users);
  console.log('Rendering... Courses:', courses);
  console.log('Rendering... ProgressData:', progressData);

  if (!users.length || !courses.length || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography>Loading data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Анализ прогресса пользователей
        </Typography>

        {/* Таблица прогресса */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Пользователь</TableCell>
                  {courses.map((course) => (
                    <TableCell key={course.id} sx={{ fontWeight: 'bold' }}>
                      {course.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.name ?? ''} {user.lastname ?? ''} ({user.email})
                    </TableCell>
                    {courses.map((course) => (
                      <TableCell key={course.id}>
                        {progressData[user.id]?.[course.id] ?? 0}%
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => router.push('/courses')}
          sx={{ mt: 4 }}
        >
          Назад к курсам
        </Button>
      </Box>
    </>
  );
}