"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, TextField, Button, Box, Link, Grid, Stack, Alert } from "@mui/material";
import { LockOutlined, Google as GoogleIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { authorize, setError } from "@/store/slices/authSlice";
import jwtDecode from "jwt-decode";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(""); // Локальное состояние для ошибки
  const isAuth = useSelector((state) => state.auth.isAuth);
  const reduxError = useSelector((state) => state.auth.error); // Ошибка из Redux
  const dispatch = useDispatch();
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_HOST;

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
          dispatch(authorize({ isAuth: true, token }));
          router.push("/layout");
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
      router.push("/layout");
    }
  }, [isAuth, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(""); // Сбрасываем локальную ошибку
    dispatch(setError(null)); // Сбрасываем ошибку в Redux

    try {
      // Выполняем запрос на сервер напрямую
      const response = await axios.post(`${host}/api/auth/login`, { email, password });
      const { token } = response.data;

      // Сохраняем токен в localStorage
      localStorage.setItem("token", token);

      // Устанавливаем авторизацию в Redux
      dispatch(authorize({ isAuth: true, token }));
    } catch (error) {
      console.error("Ошибка при входе:", error);
      const errorMessage = error.response?.data?.message || "Неверный email или пароль";
      setLocalError(errorMessage); // Устанавливаем локальную ошибку
      dispatch(setError(errorMessage)); // Устанавливаем ошибку в Redux
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <LockOutlined sx={{ fontSize: 40, color: "primary.main" }} />
        <Typography component="h1" variant="h5">
          Вход
        </Typography>
        {(localError || reduxError) && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {localError || reduxError}
          </Alert>
        )}
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
          <br />
          <Stack direction="row" spacing={2}>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Войти
            </Button>
            <Button variant="contained" onClick={() => (window.location.href = `${host}/api/auth/google`)}>
              <GoogleIcon sx={{ mr: 1 }} />
            </Button>
          </Stack>
          <br />
          <Grid container justifyContent="space-between">
            <Grid item>
              <Link href="/forgotpassword" variant="body2">
                Забыл пароль
              </Link>
            </Grid>
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