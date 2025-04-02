"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Grid,
  Stack,
  Alert,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { LockOutlined, Google as GoogleIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { authorize, setError, logoutAction } from "../../store/slices/authSlice";
import jwtDecode from "jwt-decode";
import axios from "axios";

// Создаем тему
const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981", // Зеленый акцент (emerald-500)
      contrastText: "#fff",
    },
    secondary: {
      main: "#3b82f6", // Синий акцент (blue-500)
    },
    background: {
      default: "#1f2937", // Темно-серый фон (gray-800)
      paper: "#374151", // Чуть светлее для панелей (gray-700)
    },
    text: {
      primary: "#fff",
      secondary: "#d1d5db", // Светло-серый для текста (gray-300)
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: { fontWeight: 600 },
    h6: { fontWeight: 500 },
    body2: { fontWeight: 400 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          transition: "all 0.2s ease-in-out",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            margin: '0.65rem 0px -4px 0px',
            borderColor: "#4b5563", // Gray-600
            "&:hover fieldset": {
              borderColor: "#10b981", // Зеленый при наведении
            },
          },
        },
      },
    },
  },
});

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const isAuth = useSelector((state) => state.auth.isAuth);
  const reduxError = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_HOST;

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          dispatch(logoutAction());
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          dispatch(authorize({ isAuth: true, token: storedToken }));
          router.push("/layout");
        }
      } catch (error) {
        dispatch(logoutAction());
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  }, []);

  useEffect(() => {
    if (isAuth) {
      router.push("/layout");
    }
  }, [isAuth, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    dispatch(setError(null));

    try {
      const response = await axios.post(`${host}/api/auth/login`, { email, password });
      const { token } = response.data;

      localStorage.setItem("token", token);
      dispatch(authorize({ isAuth: true, token }));
      router.push("/layout");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Неверный email или пароль";
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            bgcolor: theme.palette.background.paper,
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            py: 6,
            px: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Логотип */}
            <LockOutlined
              sx={{
                fontSize: 40,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            />

            {/* Заголовок */}
            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary,
              }}
            >
              Вход
            </Typography>

            {/* Сообщение об ошибке */}
            {(localError || reduxError) && (
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  width: "100%",
                  bgcolor: "#374151",
                  color: "#ef4444",
                  border: "1px solid #ef4444",
                }}
              >
                {localError || reduxError}
              </Alert>
            )}

            {/* Форма */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                mt: 3,
                width: "100%",
              }}
            >
              <Grid container spacing={3}>
                {/* Поле Email */}
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

                {/* Поле Пароль */}
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

              {/* Кнопки */}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    "&:hover": {
                      bgcolor: "#059669", // Темнее зеленого
                    },
                  }}
                >
                  Войти
                </Button>
                {/* <Button
                  variant="contained"
                
                  onClick={() => (window.location.href = `${host}/api/auth/google`)}
                  sx={{
                    "&:hover": {
                      bgcolor: "#059669", // Темнее синего
                    },
                  }}
                >
                  <GoogleIcon sx={{ bgcolor: "#059669",mr: 1 }} />
                </Button> */}
              </Stack>

              {/* Ссылки */}
              <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
                <Grid item>
                  <Link
                    href="/forgotpassword"
                    variant="body2"
                    sx={{
                      color: theme.palette.secondary.main,
                      "&:hover": {
                        color: theme.palette.primary.main,
                      },
                      transition: "color 0.3s ease",
                    }}
                  >
                    Забыл пароль?
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    href="/register"
                    variant="body2"
                    sx={{
                      color: theme.palette.secondary.main,
                      "&:hover": {
                        color: theme.palette.primary.main,
                      },
                      transition: "color 0.3s ease",
                    }}
                  >
                    Нет аккаунта? Зарегистрируйтесь
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;