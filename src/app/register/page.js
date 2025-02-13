// // 'use client'
// // import React, { useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import { useDispatch } from 'react-redux';
// // import { createTeacher, createUser } from '@/store/slices/authSlice';
// // import { Container, Typography, TextField, Button, Box, Link, Grid } from '@mui/material';
// // import { LockOutlined } from '@mui/icons-material';
// // import Checkbox from '@mui/material/Checkbox';

// // const RegisterPage = () => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [confirmPassword, setConfirmPassword] = useState('');
// //   const [isTeacher, setIsTeacher] = useState(false); // Исправлено имя переменной
// //   const router = useRouter();
// //   const dispatch = useDispatch();

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     // Здесь можно добавить логику для отправки данных на сервер
// //     console.log('Email:', email);
// //     console.log('Password:', password);
// //     console.log('Is Teacher:', isTeacher); // Выводим состояние isTeacher
    
// //     if (isTeacher===false){
// //       dispatch(createUser({ email, password }));
// //     }else{
// //       console.log('Ветка учителя',isTeacher)
// //       dispatch(createTeacher({ email, password }));
// //     }
// //   };

// //   return (
// //     <Container component="main" maxWidth="xs">
// //       <Box
// //         sx={{
// //           marginTop: 8,
// //           display: 'flex',
// //           flexDirection: 'column',
// //           alignItems: 'center',
// //         }}
// //       >
// //         <LockOutlined sx={{ fontSize: 40, color: 'primary.main' }} />
// //         <Typography component="h1" variant="h5">
// //           Регистрация
// //         </Typography>

// //         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
// //           <Checkbox
// //             checked={isTeacher} // Передаем текущее состояние isTeacher
// //             onChange={(e) => setIsTeacher(e.target.checked)} // Обновляем состояние isTeacher
// //             inputProps={{ 'aria-label': 'Я преподаватель' }}
// //           />
// //           Я преподаватель {isTeacher.toString()} {/* Отображаем текущее состояние isTeacher */}
// //           <Grid container spacing={2}>
// //             <Grid item xs={12}>
// //               <TextField
// //                 required
// //                 fullWidth
// //                 id="email"
// //                 label="Email"
// //                 name="email"
// //                 autoComplete="email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //               />
// //             </Grid>
// //             <Grid item xs={12}>
// //               <TextField
// //                 required
// //                 fullWidth
// //                 name="password"
// //                 label="Пароль"
// //                 type="password"
// //                 id="password"
// //                 autoComplete="new-password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //               />
// //             </Grid>
// //             <Grid item xs={12}>
// //               <TextField
// //                 required
// //                 fullWidth
// //                 name="confirmPassword"
// //                 label="Подтвердите пароль"
// //                 type="password"
// //                 id="confirmPassword"
// //                 autoComplete="new-password"
// //                 value={confirmPassword}
// //                 onChange={(e) => setConfirmPassword(e.target.value)}
// //               />
// //             </Grid>
// //           </Grid>
// //           <Button
// //             type="submit"
// //             fullWidth
// //             variant="contained"
// //             sx={{ mt: 3, mb: 2 }}
// //           >
// //             Зарегистрироваться
// //           </Button>
// //           <Grid container justifyContent="flex-end">
// //             <Grid item>
// //               <Link href="/login" variant="body2">
// //                 Уже есть аккаунт? Войдите
// //               </Link>
// //             </Grid>
// //           </Grid>
// //         </Box>
// //       </Box>
// //     </Container>
// //   );
// // };

// // export default RegisterPage;







// 'use client'
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDispatch } from 'react-redux';
// import { createUser, createUserAction } from '@/store/slices/authSlice';
// import { Container, Typography, TextField, Button, Box, Link, Grid } from '@mui/material';
// import { LockOutlined } from '@mui/icons-material';

// const RegisterPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Здесь можно добавить логику для отправки данных на сервер
//     console.log('Email:', email);
//     console.log('Password:', password);
//     dispatch(createUserAction({email,password}));
//     // Перенаправление на страницу входа после успешной регистрации
//     // router.push('/login');
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <Box
//         sx={{
//           marginTop: 8,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//         }}
//       >
//         <LockOutlined sx={{ fontSize: 40, color: 'primary.main' }} />
//         <Typography component="h1" variant="h5">
//           Регистрация
//         </Typography>
//         <Box component="form" onSubmit={()=>handleSubmit()} sx={{ mt: 3 }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 required
//                 fullWidth
//                 id="email"
//                 label="Email"
//                 name="email"
//                 autoComplete="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 required
//                 fullWidth
//                 name="password"
//                 label="Пароль"
//                 type="password"
//                 id="password"
//                 autoComplete="new-password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 required
//                 fullWidth
//                 name="confirmPassword"
//                 label="Подтвердите пароль"
//                 type="password"
//                 id="confirmPassword"
//                 autoComplete="new-password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//               />
//             </Grid>
//           </Grid>
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//           >
//             Зарегистрироваться
//           </Button>
//           <Grid container justifyContent="flex-end">
//             <Grid item>
//               <Link href="/login" variant="body2">
//                 Уже есть аккаунт? Войдите
//               </Link>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default RegisterPage;




'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createUserAction,createTeacherAction } from '@/store/slices/authSlice';
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
     
      console.log('Is Teacher:', isTeacher); // Выводим состояние isTeacher
    
        if (isTeacher===false){
          await dispatch(createUserAction({ email, password }));  
          setSuccessMessage('Регистрация прошла успешно!');
          setOpenSnackbar(true);
        }else{
          console.log('Ветка учителя',isTeacher)
          dispatch(createTeacherAction({ email, password }));
        }
      

     
    

      setTimeout(() => {
        // router.push('/login');
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
        <h5>Я преподаватель
        <Checkbox
            checked={isTeacher} // Передаем текущее состояние isTeacher
            onChange={(e) => setIsTeacher(e.target.checked)} // Обновляем состояние isTeacher
            inputProps={{ 'aria-label': 'Я преподаватель' }}
          /> 
         </h5>
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
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
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
