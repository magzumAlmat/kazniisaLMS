'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, TextField, Button, Box, Link, Grid } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useDispatch ,useSelector} from 'react-redux';
import { authorize ,createUser, loginAction} from '@/store/slices/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const router=useRouter()
  
  const isAuth=useSelector((state)=>state.auth.isAuth)
  
  if( isAuth==true){
    console.log('Вы залогинены')
    // router.push('/layout');
  }

  const dispatch=useDispatch()

  const handleSubmit = (e) => {
    
    e.preventDefault();
    // Здесь можно добавить логику для отправки данных на сервер
    console.log('Email:', email);
    console.log('Password:', password);

   dispatch(loginAction({email,password}))
   
    router.push('/layout');
    // Перенаправление на главную страницу после успешного входа
    

  };

  return (
    
    <Container component="main" maxWidth="xs">
     1
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
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;