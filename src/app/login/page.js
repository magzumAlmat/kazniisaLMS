'use client';
import React, { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation'; // Используем next/navigation вместо next/router
import { Container, Typography, TextField, Button, Box, Link, Grid,Stack } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { authorize, loginAction } from '@/store/slices/authSlice';
import GoogleIcon from '@mui/icons-material/Google';
import GoogleButton from 'react-google-button'
import ButtonGroup from '@mui/material/ButtonGroup';
import axios from 'axios';
import SaveIcon from '@mui/icons-material/Save';
const LoginPage = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isAuth = useSelector((state) => state.auth.isAuth); // Получаем состояние авторизации
  const dispatch = useDispatch();
  const router = useRouter();
  const host=process.env.NEXT_PUBLIC_HOST
  // Эффект для отслеживания изменения isAuth

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.error("Token expired");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          dispatch(authorize(true));
          router.push('/layout');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  }, [dispatch, router]);
  
  
  useEffect(() => {
    if (isAuth) {
      router.push('/layout'); // Перенаправляем на /layout, если isAuth === true
    }
  }, [isAuth, router]);




  const handleSubmit = (e) => {
    // e.preventDefault();
    // dispatch(loginAction({ email, password }))
    //   .then(() => {
    //     dispatch(authorize(true)); 
    //   })
    //   .catch((error) => {
    //     console.error('Ошибка при входе:', error);
       
    //   });
    e.preventDefault();
    
    dispatch(loginAction({ email, password }))
    .then(() => {
      dispatch(authorize(true));
    })
    .catch((error) => {
      // console.error("Ошибка при входе:", error);
      // alert("Неверный email или пароль"); // Show error message
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
          {/* <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>


          <GoogleButton
              onClick={() => { redirect('${host}/api/auth/google') }}
             type="light"
            /> */}
        <br />
        <Stack direction="row" spacing={2}>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Войти
          </Button>
      <Button variant="contained"   onClick={() => { redirect(`${host}/api/auth/google`) }}>
      <GoogleIcon mr={ 2 }/>
      </Button>
    </Stack>


<br />

{/* <ButtonGroup variant="outlined" aria-label="Loading button group" spacing={2}>
      <Button size="large">   Войти   </Button>
      <divider/>
    
    
    
      <GoogleButton
              onClick={() => { redirect('${host}/api/auth/google') }}
             type="light"
            />
     
    </ButtonGroup> */}

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/register" variant="body2">
                Нет аккаунта? Зарегистрируйтесь
              </Link>
            </Grid>
          </Grid>

          {/* Кнопка входа через Google */}
          <Box sx={{ mt: 2, width: '100%' }}>
       
{/* 
          <GoogleButton
              onClick={() => { redirect('${host}/api/auth/google') }}
             type="light"
            /> */}
            {/* <Button
              variant="outlined"
              fullWidth
             
              href=`${host}/api/auth/google" // URL для Google OAuth
              sx={{
                textTransform: 'none',
                color: '#000',
                borderColor: '#ccc',
                '&:hover': {
                  borderColor: '#aaa',
                },
              }}
            >
              <GoogleIcon mr={ 2 }/>  Войти через Google
            </Button> */}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;