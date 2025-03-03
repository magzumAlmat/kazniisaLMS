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
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import TopMenu from '@/components/topmenu';
import { logoutAction, getAllCoursesAction } from '@/store/slices/authSlice';

export default function StreamsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = localStorage.getItem('token');

  const [streams, setStreams] = useState([]);
  const [users, setUsers] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openStudents, setOpenStudents] = useState(false);
  const [openViewStudents, setOpenViewStudents] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newStream, setNewStream] = useState({
    name: '',
    startDate: '',
    endDate: '',
    cost: '',
    maxStudents: '',
    courseId: '',
    teacherId: '',
  });
  const [editStream, setEditStream] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const { courses } = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        router.push('/login');
        return;
      }
      setLoading(true);
      try {
        const streamsResponse = await axios.get('http://localhost:4000/api/streams', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Streams Response:', streamsResponse.data);

        const streamsWithStudents = await Promise.all(
          streamsResponse.data.streams.map(async (stream) => {
            const studentsResponse = await axios.get(
              `http://localhost:4000/api/streams/getstudentsbystreamid/${stream.id}`,
              // Исправлен путь
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { ...stream, students: studentsResponse.data.students };
          })
        );
        setStreams(streamsWithStudents || []);

        const usersResponse = await axios.get('http://localhost:4000/api/getallusers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Users Response:', usersResponse.data);
        setUsers(usersResponse.data.users || []);

        dispatch(getAllCoursesAction());
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    fetchUserInfo();
  }, [dispatch, token, router]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/auth/getAuthentificatedUserInfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке информации о пользователе:', err);
      if (err.response && err.response.status === 401) {
        // Перенаправляем на страницу логина при 401
        router.push('/login');
      }
    }
  };
  const handleCreateStream = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/streams',
        {
          ...newStream,
          cost: Number(newStream.cost),
          maxStudents: Number(newStream.maxStudents),
          courseId: Number(newStream.courseId),
          teacherId: Number(newStream.teacherId),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStreams([...streams, { ...response.data.stream, students: [] }]);
      setOpenCreate(false);
      setNewStream({ name: '', startDate: '', endDate: '', cost: '', maxStudents: '', courseId: '', teacherId: '' });
    } catch (err) {
      console.error('Ошибка при создании потока:', err);
      setError('Ошибка при создании потока');
    }
  };

  const handleUpdateStream = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/streams/${editStream.id}`,
        {
          ...editStream,
          cost: Number(editStream.cost),
          maxStudents: Number(editStream.maxStudents),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStreams(streams.map((s) => (s.id === editStream.id ? response.data.stream : s)));
      setOpenEdit(false);
      setEditStream(null);
    } catch (err) {
      console.error('Ошибка при обновлении потока:', err);
      setError('Ошибка при обновлении потока');
    }
  };

  const handleDeleteStream = async (streamId) => {
    try {
      await axios.delete(`http://localhost:4000/api/streams/${streamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStreams(streams.filter((s) => s.id !== streamId));
    } catch (err) {
      console.error('Ошибка при удалении потока:', err);
      setError('Ошибка при удалении потока');
    }
  };

  const handleAddStudents = async () => {
    try {
      await axios.post(
        `http://localhost:4000/api/streams/${selectedStream.id}/students`,
        { studentIds: selectedStudents },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedStreamResponse = await axios.get(`http://localhost:4000/api/streams/getstudentsbystreamid/${selectedStream.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStreams(streams.map((s) => (s.id === selectedStream.id ? { ...s, students: updatedStreamResponse.data.students } : s)));
      setOpenStudents(false);
      setSelectedStudents([]);
    } catch (err) {
      console.error('Ошибка при добавлении студентов:', err);
      setError('Ошибка при добавлении студентов');
    }
  };

  // const handleRemoveStudent = async (streamId, studentId) => {
  //   console.log('1 Удаление юзера',streamId,studentId)
  //   try {
  //     await axios.post(
  //       `http://localhost:4000/api/streams/${streamId}/remove-students`,
  //       { studentIds: [studentId] }, // Отправляем массив studentIds в теле запроса
  //       // { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     const updatedStreamResponse = await axios.get( `http://localhost:4000/api/streams/getstudentsbystreamid/${stream.id}`
  //     // , {
  //     //   headers: { Authorization: `Bearer ${token}` },
  //     // }
  //   );
  //     setStreams(streams.map((s) => (s.id === streamId ? { ...s, students: updatedStreamResponse.data.students } : s)));

  //   } catch (err) {
  //     console.error('Ошибка при удалении студента:', err);
  //     setError('Ошибка при удалении студента');
  //   }
  // };

  const handleRemoveStudent = async (streamId, studentId) => {
    console.log('1 Удаление юзера', streamId, studentId);
    try {
      // Удаляем студента из потока
      await axios.post(
        `http://localhost:4000/api/streams/${streamId}/remove-students`,
        { studentIds: [studentId] }, // Отправляем массив studentIds в теле запроса
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Получаем обновленный список студентов для потока
      const updatedStreamResponse = await axios.get(
       `http://localhost:4000/api/streams/getstudentsbystreamid/${streamId}`, // Исправлен путь и использован streamId
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Обновляем состояние streams с актуальным списком студентов
      setStreams(streams.map((s) => (s.id === streamId ? { ...s, students: updatedStreamResponse.data.students } : s)));
    } catch (err) {
      console.error('Ошибка при удалении студента:', err);
      setError('Ошибка при удалении студента');
    }
    setOpenStudents(false);
      setSelectedStudents([]);
    // alert('Юзер успешно удален')
  };


  
  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Управление потоками
        </Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Button variant="contained" color="primary" onClick={() => setOpenCreate(true)} sx={{ mb: 3 }}>
          Создать поток
        </Button>

        {streams.length === 0 ? (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              Потоки отсутствуют. Создайте новый поток, чтобы начать.
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow><TableCell>Название</TableCell><TableCell>Курс</TableCell><TableCell>Учитель</TableCell><TableCell>Дата начала</TableCell><TableCell>Дата окончания</TableCell><TableCell>Стоимость</TableCell><TableCell>Макс. студентов</TableCell><TableCell>Действия</TableCell></TableRow>
                </TableHead>
                <TableBody>
                  {streams.map((stream) => (
                    <TableRow key={stream.id}><TableCell>{stream.name}</TableCell><TableCell>{stream.course?.title || 'Не указан'}</TableCell><TableCell>{stream.teacher ? `${stream.teacher.name ?? ''} ${stream.teacher.lastname ?? ''}` : 'Не указан'}</TableCell><TableCell>{new Date(stream.startDate).toLocaleDateString()}</TableCell><TableCell>{new Date(stream.endDate).toLocaleDateString()}</TableCell><TableCell>{stream.cost}</TableCell><TableCell>{stream.maxStudents}</TableCell><TableCell><Button onClick={() => { setEditStream(stream); setOpenEdit(true); }}>Редактировать</Button><Button color="error" onClick={() => handleDeleteStream(stream.id)}>Удалить</Button><Button onClick={() => { setSelectedStream(stream); setOpenStudents(true); }}>Студенты</Button><Button onClick={() => { setSelectedStream(stream); setOpenViewStudents(true); }}>Просмотр студентов</Button></TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
          <DialogTitle>Создать новый поток</DialogTitle>
          <DialogContent>
            <TextField
              label="Название"
              fullWidth
              value={newStream.name}
              onChange={(e) => setNewStream({ ...newStream, name: e.target.value })}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Курс</InputLabel>
              <Select
                value={newStream.courseId}
                onChange={(e) => setNewStream({ ...newStream, courseId: e.target.value })}
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Учитель</InputLabel>
              <Select
                value={newStream.teacherId}
                onChange={(e) => setNewStream({ ...newStream, teacherId: e.target.value })}
              >
                {users.filter((u) => u.roleId === 2).map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.name ?? ''} {teacher.lastname ?? ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Дата начала"
              type="date"
              fullWidth
              value={newStream.startDate}
              onChange={(e) => setNewStream({ ...newStream, startDate: e.target.value })}
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Дата окончания"
              type="date"
              fullWidth
              value={newStream.endDate}
              onChange={(e) => setNewStream({ ...newStream, endDate: e.target.value })}
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Стоимость"
              type="number"
              fullWidth
              value={newStream.cost}
              onChange={(e) => setNewStream({ ...newStream, cost: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Макс. студентов"
              type="number"
              fullWidth
              value={newStream.maxStudents}
              onChange={(e) => setNewStream({ ...newStream, maxStudents: e.target.value })}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreate(false)}>Отмена</Button>
            <Button onClick={handleCreateStream} color="primary">Создать</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Редактировать поток</DialogTitle>
          <DialogContent>
            {editStream && (
              <>
                <TextField
                  label="Название"
                  fullWidth
                  value={editStream.name}
                  onChange={(e) => setEditStream({ ...editStream, name: e.target.value })}
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Дата начала"
                  type="date"
                  fullWidth
                  value={editStream.startDate.split('T')[0]}
                  onChange={(e) => setEditStream({ ...editStream, startDate: e.target.value })}
                  sx={{ mt: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Дата окончания"
                  type="date"
                  fullWidth
                  value={editStream.endDate.split('T')[0]}
                  onChange={(e) => setEditStream({ ...editStream, endDate: e.target.value })}
                  sx={{ mt: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Стоимость"
                  type="number"
                  fullWidth
                  value={editStream.cost}
                  onChange={(e) => setEditStream({ ...editStream, cost: e.target.value })}
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Макс. студентов"
                  type="number"
                  fullWidth
                  value={editStream.maxStudents}
                  onChange={(e) => setEditStream({ ...editStream, maxStudents: e.target.value })}
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Отмена</Button>
            <Button onClick={handleUpdateStream} color="primary">Сохранить</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openStudents} onClose={() => setOpenStudents(false)}>
          <DialogTitle>Управление студентами в потоке</DialogTitle>
          <DialogContent>
            {selectedStream && (
              <>
                <Typography>Текущие студенты:</Typography>
                <Box sx={{ mt: 2 }}>
                  {selectedStream.students?.map((student) => (
                    <Chip
                      key={student.id}
                      label={`${student.name ?? ''} ${student.lastname ?? ''} ${student.email ?? ''}`}
                      onDelete={() => handleRemoveStudent(selectedStream.id, student.id)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                  {!selectedStream.students?.length && <Typography>Нет студентов</Typography>}
                </Box>
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel>Добавить студентов</InputLabel>
                  <Select
                    multiple
                    value={selectedStudents}
                    onChange={(e) => setSelectedStudents(e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((id) => {
                          const student = users.find((u) => u.id === id);
                          return <Chip key={id} label={`${student?.name ?? ''} ${student?.lastname ?? ''}`} />;
                        })}
                      </Box>
                    )}
                  >
                    {users
                      .filter((u) => u.roleId === 3 && !selectedStream.students?.some((s) => s.id === u.id))
                      .map((student) => (
                        <MenuItem key={student.id} value={student.id}>
                          {student.name ?? ''} {student.lastname ?? ''} ({student.email})
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStudents(false)}>Закрыть</Button>
            <Button onClick={handleAddStudents} color="primary">Добавить</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openViewStudents} onClose={() => setOpenViewStudents(false)}>
          <DialogTitle>Студенты в потоке: {selectedStream?.name}</DialogTitle>
          <DialogContent>
            {selectedStream && (
              <>
                <Typography>Список студентов:</Typography>
                <Box sx={{ mt: 2 }}>
                  {selectedStream.students?.length > 0 ? (
                    selectedStream.students.map((student) => (
                      <Typography key={student.id} sx={{ mb: 1 }}>
                        {student.name ?? ''} {student.lastname ?? ''} ({student.email})
                      </Typography>
                    ))
                  ) : (
                    <Typography>Нет студентов в этом потоке</Typography>
                  )}
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewStudents(false)}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}