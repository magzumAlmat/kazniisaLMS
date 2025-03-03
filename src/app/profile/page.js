'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import TopMenu from "@/components/topmenu";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "@/store/slices/authSlice";
const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null); // Инициализируем как null
  const token = localStorage.getItem("token");
  const [profileData, setProfileData] = useState({
    name: "",
    lastname: "",
    phone: "",
  });
  const dispatch=useDispatch()
  const router=useRouter()
  // Загрузка данных профиля при монтировании компонента
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке профиля:", error);
      }
    };

    fetchProfile();
    fetchUserInfo();
  }, []);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:4000/api/profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Профиль успешно обновлен!");
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);

      if (error.response) {
        alert(`Ошибка: ${error.response.data.message || "Попробуйте позже."}`);
      } else {
        alert("Не удалось подключиться к серверу.");
      }
    }
  };

    const handleLogout = () => {
      dispatch(logoutAction());
      localStorage.removeItem("token");
      window.location.href = "/login";
    };


    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get('http://localhost:4000/api/auth/getAuthentificatedUserInfo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке информации о пользователе:', err);
        if (err.response && err.response.status === 401) {
          // Перенаправляем на страницу логина при 401
          router.push('/login');
        }
      }
    };
  return (<>
    <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Мой профиль</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Имя:</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            placeholder="Введите имя"
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Фамилия:</label>
          <input
            type="text"
            name="lastname"
            value={profileData.lastname}
            onChange={handleChange}
            placeholder="Введите фамилию"
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Телефон:</label>
          <input
            type="text"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
            placeholder="Введите телефон"
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 15px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Сохранить
        </button>
      </form>
    </div>
    </>
  );
};

export default ProfilePage;