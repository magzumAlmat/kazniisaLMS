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
  console.log('Dispatch:', dispatch);

  const router = useRouter();
  console.log('Router:', router);

  const token = localStorage.getItem('token');
  console.log('Token:', token);

  const [streams, setStreams] = useState([]);
  console.log('Streams:', streams);

  const [users, setUsers] = useState([]);
  console.log('Users:', users);

  const [openCreate, setOpenCreate] = useState(false);
  console.log('OpenCreate:', openCreate);

  const [openEdit, setOpenEdit] = useState(false);
  console.log('OpenEdit:', openEdit);

  const [openStudents, setOpenStudents] = useState(false);
  console.log('OpenStudents:', openStudents);

  const [loading, setLoading] = useState(false);
  console.log('Loading:', loading);

  const [error, setError] = useState(null);
  console.log('Error:', error);

  const [newStream, setNewStream] = useState({
    name: '',
    startDate: '',
    endDate: '',
    cost: '',
    maxStudents: '',
    courseId: '',
    teacherId: '',
  });
  console.log('NewStream:', newStream);

  const [editStream, setEditStream] = useState(null);
  console.log('EditStream:', editStream);

  const [selectedStream, setSelectedStream] = useState(null);
  console.log('SelectedStream:', selectedStream);

  const [selectedStudents, setSelectedStudents] = useState([]);
  console.log('SelectedStudents:', selectedStudents);

  const { courses } = useSelector((state) => state.auth);
  console.log('Courses from Redux:', courses);

  const [userInfo, setUserInfo] = useState(null); // Инициализируем как null
  // Отслеживание обновлений streams
  useEffect(() => {
    console.log('Streams updated:', streams);
  }, [streams]);

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log('Set Loading to true');

      try {
        console.log('Fetching streams...');
        const streamsResponse = await axios.get('http://localhost:4000/api/streams', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Streams Response:', streamsResponse.data);
        setStreams(streamsResponse.data.streams);
        console.log('Streams after set:', streams);

        console.log('Fetching users...');
        const usersResponse = await axios.get('http://localhost:4000/api/getallusers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Users Response:', usersResponse.data);
        setUsers(usersResponse.data.users);
        console.log('Users after set:', users);

        console.log('Dispatching getAllCoursesAction...');
        dispatch(getAllCoursesAction());
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить данные');
        console.log('Error after set:', error);
      } finally {
        setLoading(false);
        console.log('Set Loading to false');
      }
    };
    fetchData();
    fetchUserInfo()
  }, [dispatch, token]);

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
  // Создание потока
  const handleCreateStream = async () => {
    console.log('HandleCreateStream called with:', newStream);
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
      console.log('Create Stream Response:', response.data);
      setStreams([...streams, response.data.stream]);
      console.log('Streams after create:', streams);
      setOpenCreate(false);
      console.log('OpenCreate after set:', openCreate);
      setNewStream({ name: '', startDate: '', endDate: '', cost: '', maxStudents: '', courseId: '', teacherId: '' });
      console.log('NewStream after reset:', newStream);
    } catch (err) {
      console.error('Ошибка при создании потока:', err);
      setError('Ошибка при создании потока');
      console.log('Error after set:', error);
    }
  };

  // Обновление потока
  const handleUpdateStream = async () => {
    console.log('HandleUpdateStream called with:', editStream);
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
      console.log('Update Stream Response:', response.data);
      setStreams(streams.map((s) => (s.id === editStream.id ? response.data.stream : s)));
      console.log('Streams after update:', streams);
      setOpenEdit(false);
      console.log('OpenEdit after set:', openEdit);
      setEditStream(null);
      console.log('EditStream after set:', editStream);
    } catch (err) {
      console.error('Ошибка при обновлении потока:', err);
      setError('Ошибка при обновлении потока');
      console.log('Error after set:', error);
    }
  };

  // Удаление потока
  const handleDeleteStream = async (streamId) => {
    console.log('HandleDeleteStream called with streamId:', streamId);
    try {
      await axios.delete(`http://localhost:4000/api/streams/${streamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Stream deleted successfully');
      setStreams(streams.filter((s) => s.id !== streamId));
      console.log('Streams after delete:', streams);
    } catch (err) {
      console.error('Ошибка при удалении потока:', err);
      setError('Ошибка при удалении потока');
      console.log('Error after set:', error);
    }
  };

  // Добавление студентов в поток
  const handleAddStudents = async () => {
    console.log('HandleAddStudents called with stream:', selectedStream, 'students:', selectedStudents);
    try {
      await axios.post(
        `http://localhost:4000/api/streams/${selectedStream.id}/students`,
        { studentIds: selectedStudents },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Students added successfully');
      const updatedStream = await axios.get(`http://localhost:4000/api/streams/${selectedStream.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Updated Stream Response:', updatedStream.data);
      setStreams(streams.map((s) => (s.id === selectedStream.id ? updatedStream.data.stream : s)));
      console.log('Streams after adding students:', streams);
      setOpenStudents(false);
      console.log('OpenStudents after set:', openStudents);
      setSelectedStudents([]);
      console.log('SelectedStudents after reset:', selectedStudents);
    } catch (err) {
      console.error('Ошибка при добавлении студентов:', err);
      setError('Ошибка при добавлении студентов');
      console.log('Error after set:', error);
    }
  };

  // Удаление студентов из потока
  const handleRemoveStudent = async (streamId, studentId) => {
    console.log('HandleRemoveStudent called with streamId:', streamId, 'studentId:', studentId);
    try {
      await axios.post(
        `http://localhost:4000/api/streams/${streamId}/remove-students`,
        { studentIds: [studentId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Student removed successfully');
      const updatedStream = await axios.get(`http://localhost:4000/api/streams/${streamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Updated Stream Response:', updatedStream.data);
      setStreams(streams.map((s) => (s.id === streamId ? updatedStream.data.stream : s)));
      console.log('Streams after removing student:', streams);
    } catch (err) {
      console.error('Ошибка при удалении студента:', err);
      setError('Ошибка при удалении студента');
      console.log('Error after set:', error);
    }
  };

  const handleLogout = () => {
    console.log('HandleLogout called');
    dispatch(logoutAction());
    localStorage.removeItem('token');
    router.push('/login');
  };

  console.log('Rendering...');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TopMenu handleLogout={handleLogout}  userInfo={userInfo} />
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
                  <TableRow>
                    <TableCell>Название</TableCell>
                    <TableCell>Курс</TableCell>
                    <TableCell>Учитель</TableCell>
                    <TableCell>Дата начала</TableCell>
                    <TableCell>Дата окончания</TableCell>
                    <TableCell>Стоимость</TableCell>
                    <TableCell>Макс. студентов</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {streams.map((stream) => {
                    console.log('Rendering stream:', stream);
                    return (
                      <TableRow key={stream.id}>
                        <TableCell>{stream.name}</TableCell>
                        <TableCell>{stream.course?.title || 'Не указан'}</TableCell>
                        <TableCell>{stream.teacher ? `${stream.teacher.name} ${stream.teacher.lastname}` : 'Не указан'}</TableCell>
                        <TableCell>{new Date(stream.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(stream.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>{stream.cost}</TableCell>
                        <TableCell>{stream.maxStudents}</TableCell>
                        <TableCell>
                          <Button onClick={() => { setEditStream(stream); setOpenEdit(true); }}>Редактировать</Button>
                          <Button color="error" onClick={() => handleDeleteStream(stream.id)}>Удалить</Button>
                          <Button onClick={() => { setSelectedStream(stream); setOpenStudents(true); }}>Студенты</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                    {teacher.name} {teacher.lastname}
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
                      label={`${student.name ?? ''} ${student.lastname ?? ''}`}
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
      </Box>
    </>
  );
}