'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createUserAction, createTeacherAction } from '../../store/slices/authSlice';
import { Container, Typography, TextField, Button, Box, Link, Grid, Snackbar, Alert } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import Checkbox from '@mui/material/Checkbox';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false); // Новое состояние для блокировки кнопки
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Очистка сообщений перед новой попыткой
    setSuccessMessage('');
    setErrorMessage('');

    if (!email || !password || !confirmPassword) {
      setErrorMessage('Все поля обязательны для заполнения.');
      setOpenSnackbar(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Пароли не совпадают.');
      setOpenSnackbar(true);
      return;
    }

    try {
      console.log('Is Teacher:', isTeacher);

      await dispatch(createUserAction({ email, password }));
      setSuccessMessage('Регистрация прошла успешно! Пройдите по ссылке в письме подтверждения!');
      setOpenSnackbar(true);
      setIsSubmitDisabled(true); // Блокируем кнопку после успеха

      setTimeout(() => {
        // router.push('/login'); // Оставляем как опцию для перенаправления
      }, 3000);
    } catch (error) {
      setErrorMessage('Ошибка при регистрации: ' + (error.message || 'Попробуйте снова.'));
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <LockOutlined sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <br />
        {/* <h5>Я преподаватель
        <Checkbox
            checked={isTeacher} 
            onChange={(e) => setIsTeacher(e.target.checked)} 
            inputProps={{ 'aria-label': 'Я преподаватель' }}
          /> 
         </h5> */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Подтвердите пароль"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitDisabled} // Устанавливаем свойство disabled
          >
            Зарегистрироваться
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Уже есть аккаунт? Войдите
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={successMessage ? 'success' : 'error'} sx={{ width: '100%' }}>
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterPage;