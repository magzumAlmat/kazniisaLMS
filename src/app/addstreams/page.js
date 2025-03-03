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
      setLoading(true);
      try {
        const streamsResponse = await axios.get('http://localhost:4000/api/streams', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStreams(streamsResponse.data.streams);

        const usersResponse = await axios.get('http://localhost:4000/api/getallusers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data.users);

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
  }, [dispatch, token]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/auth/getAuthentificatedUserInfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке информации о пользователе:', error);
    }
  };

  const handleCreateStream = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:4000/api/streams', // Исправлен endpoint на /streams
        {
          ...newStream,
          cost: parseFloat(newStream.cost),
          maxStudents: parseInt(newStream.maxStudents, 10),
          courseId: parseInt(newStream.courseId, 10),
          teacherId: parseInt(newStream.teacherId, 10),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStreams((prev) => [...prev, response.data.stream]);
      setOpenCreate(false);
      setNewStream({
        name: '',
        startDate: '',
        endDate: '',
        cost: '',
        maxStudents: '',
        courseId: '',
        teacherId: '',
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при создании потока');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStream = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:4000/api/streams/${editStream.id}`,
        {
          name: editStream.name,
          startDate: editStream.startDate,
          endDate: editStream.endDate,
          cost: parseFloat(editStream.cost),
          maxStudents: parseInt(editStream.maxStudents, 10),
          teacherId: parseInt(editStream.teacherId, 10), // Добавляем teacherId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStreams((prev) => prev.map((s) => (s.id === editStream.id ? response.data.stream : s)));
      setOpenEdit(false);
      setEditStream(null);
      setError(null);
    } catch (err) {
      console.error('Ошибка при обновлении потока:', err);
      setError('Ошибка при обновлении потока');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStream = async (streamId) => {
    try {
      await axios.delete(`http://localhost:4000/api/streams/${streamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStreams((prev) => prev.filter((s) => s.id !== streamId));
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
      const updatedStream = await axios.get(`http://localhost:4000/api/streams/${selectedStream.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStreams((prev) => prev.map((s) => (s.id === selectedStream.id ? updatedStream.data.stream : s)));
      setOpenStudents(false);
      setSelectedStudents([]);
    } catch (err) {
      console.error('Ошибка при добавлении студентов:', err);
      setError('Ошибка при добавлении студентов');
    }
  };

  const handleRemoveStudent = async (streamId, studentId) => {
    try {
      await axios.post(
        `http://localhost:4000/api/streams/${streamId}/remove-students`,
        { studentIds: [studentId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedStream = await axios.get(`http://localhost:4000/api/streams/${streamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStreams((prev) => prev.map((s) => (s.id === streamId ? updatedStream.data.stream : s)));
    } catch (err) {
      console.error('Ошибка при удалении студента:', err);
      setError('Ошибка при удалении студента');
    }
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

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreate(true)}
          sx={{ mb: 3 }}
          disabled={!courses.length || !users.length}
        >
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
                  <TableRow><TableCell>Название</TableCell><TableCell>Курс</TableCell><TableCell>Учитель</TableCell><TableCell>Дата начала</TableCell><TableCell>Дата окончания</TableCell><TableCell>Стоимость</TableCell><TableCell>Макс. студентов</TableCell><TableCell>Студенты</TableCell><TableCell>Действия</TableCell></TableRow>
                </TableHead>
                <TableBody>
                  {streams.map((stream) => (
                    <TableRow key={stream.id}><TableCell>{stream.name}</TableCell><TableCell>{stream.course?.title || 'Не указан'}</TableCell><TableCell>{stream.teacher ? `${stream.teacher.name ?? ''} ${stream.teacher.lastname ?? ''}` : 'Не указан'}</TableCell><TableCell>{new Date(stream.startDate).toLocaleDateString()}</TableCell><TableCell>{new Date(stream.endDate).toLocaleDateString()}</TableCell><TableCell>{stream.cost}</TableCell><TableCell>{stream.maxStudents}</TableCell><TableCell>{stream.students?.length > 0 ? (<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{stream.students.map((student) => (<Chip key={student.id} label={`${student.name ?? ''} ${student.lastname ?? ''}`} size="small" sx={{ m: 0.5 }} />))}</Box>) : 'Нет студентов'}</TableCell><TableCell><Button onClick={() => { setEditStream(stream); setOpenEdit(true); }}>Редактировать</Button><Button color="error" onClick={() => handleDeleteStream(stream.id)}>Удалить</Button><Button onClick={() => { setSelectedStream(stream); setOpenStudents(true); }}>Студенты</Button></TableCell></TableRow>
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
                value={newStream.courseId || ''}
                onChange={(e) => setNewStream({ ...newStream, courseId: e.target.value })}
              >
                <MenuItem value=""><em>Выберите курс</em></MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Учитель</InputLabel>
              <Select
                value={newStream.teacherId || ''}
                onChange={(e) => setNewStream({ ...newStream, teacherId: e.target.value })}
              >
                <MenuItem value=""><em>Выберите учителя</em></MenuItem>
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
            <Button
              onClick={handleCreateStream}
              color="primary"
              disabled={!newStream.courseId || !newStream.teacherId}
            >
              Создать
            </Button>
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
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Учитель</InputLabel>
                  <Select
                    value={editStream.teacherId || ''}
                    onChange={(e) => setEditStream({ ...editStream, teacherId: e.target.value })}
                  >
                    <MenuItem value=""><em>Выберите учителя</em></MenuItem>
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
            <Button onClick={handleUpdateStream} color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Сохранить'}
            </Button>
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