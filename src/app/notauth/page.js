'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import TopMenu from "../../components/topmenu";
import { useRouter } from "next/navigation";
import { useDispatch ,useSelector} from "react-redux";
import { logoutAction } from "../../store/slices/authSlice";
import { Container } from "@mui/material";
const NotAuth = () => {
    const [userInfo, setUserInfo] = useState(null);
     const isAuth = useSelector((state) => state.auth.isAuth); // Получаем состояние авторизации
      const dispatch = useDispatch();
      const router = useRouter();
      const host=process.env.NEXT_PUBLIC_HOST
      const token = localStorage.getItem("token");

 useEffect(() => {
    if (!token) {
      // router.push('/login');
      console.log('token is null',token)
      return;
    }

    fetchUserInfo();
  }, [router]);

      const fetchUserInfo = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserInfo(response.data);
        } catch (err) {
          console.error('Ошибка при загрузке информации о пользователе:', err);
          if (err.response && err.response.status === 401) {
            router.push('/login');
          }
        }
      };


        const handleLogout = () => {
          dispatch(logoutAction());
          localStorage.removeItem("token");
          router.push("/login");
        };

    return(<>
       <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
       <Container>
<h3>Свяжитесь с администрацией, чтобы вам дали доступ</h3>
</Container>
</>)}

export default NotAuth