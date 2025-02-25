'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Используем next/navigation вместо next/router
import { Container, Typography, TextField, Button, Box, Link, Grid } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { authorize, loginAction } from '@/store/slices/authSlice';

const LoginPage = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isAuth = useSelector((state) => state.auth.isAuth); // Получаем состояние авторизации
  const dispatch = useDispatch();
  const router = useRouter();

  // Эффект для отслеживания изменения isAuth
  useEffect(() => {
    if (isAuth) {
      router.push('/layout'); // Перенаправляем на /layout, если isAuth === true
    }
  }, [isAuth, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAction({ email, password }))
      .then(() => {
        dispatch(authorize(true)); // Устанавливаем авторизацию
      })
      .catch((error) => {
        console.error('Ошибка при входе:', error);
        // Здесь можно добавить отображение ошибки пользователю
      });
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
          Вход
        </Typography>
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/register" variant="body2">
                Нет аккаунта? Зарегистрируйтесь
              </Link>
            </Grid>
          </Grid>

          {/* Кнопка входа через Google */}
          <Box sx={{ mt: 2, width: '100%' }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<img src="/google-icon.png" alt="Google" style={{ width: 20, marginRight: 10 }} />}
              href="http://localhost:4000/api/auth/google" // URL для Google OAuth
              sx={{
                textTransform: 'none',
                color: '#000',
                borderColor: '#ccc',
                '&:hover': {
                  borderColor: '#aaa',
                },
              }}
            >
              Войти через Google
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;