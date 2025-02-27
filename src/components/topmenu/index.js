// components/TopMenu.js
import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";

const TopMenu = ({ userInfo, handleLogout }) => {
  // console.log('1 userInfo= ',userInfo)
 

  // Отрисовка контента в зависимости от роли пользователя
  const renderContentByRole = (courses) => {
    // console.log('userINFO= ',userInfo)
    if (!userInfo) return null;

    if (userInfo.roleId === 1) {
      // Администратор
      return (
        <div>
          <h2>Админ-панель</h2>
          {courses && courses.length > 0 ? (
            courses.map((course) => <div key={course.id}>{course.title}</div>)
          ) : (
            <p>Нет доступных курсов.</p>
          )}
        </div>
      );
    } else if (userInfo.roleId === 2) {
      // Учитель
      return (
        <div>
          <h2>Панель учителя</h2>
          {courses && courses.length > 0 ? (
            courses.map((course) => <div key={course.id}>{course.title}</div>)
          ) : (
            <p>Нет доступных курсов.</p>
          )}
        </div>
      );
    } else if (userInfo.roleId === 3) {

      // Студент
      const latestItem = progress
        .filter((item) => item.user_id === userInfo.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      if (latestItem) {
        const lesson = lessons.find((les) => les.id === latestItem.lesson_id);
        return (
          <div>
       
            <h2>Последний прогресс</h2>
            <p>
              Статус: {latestItem.status} по предмету{" "}
              {lesson ? lesson.title || lesson.content : "Данные не доступны"}
            </p>
          </div>
        );
      } else {
        return <p>Нет данных о прогрессе.</p>;
      }
    } else {
      return <p>Роль не определена.</p>;
    }
  };

  // Функция для отрисовки меню в зависимости от роли пользователя
  const renderMenuByRole = () => {
    if (!userInfo) return null;

    if (userInfo.roleId === 1) {
      // Администратор
      return (
        <>
          <Button color="inherit" component={Link} href="/">
            Главная
          </Button>
          <Button color="inherit" component={Link} href="/admin/add-role">
            Добавить роль
          </Button>
          <Button color="inherit" component={Link} href="/profile">
            Профиль
          </Button>
          <Button color="inherit" component={Link} href="/admin/dashboard">
            Админ-панель
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        </>
      );
    } else if (userInfo.roleId === 2) {
      // Учитель
      return (
        <>
          <Button color="inherit" component={Link} href="/">
            Главная
          </Button>
          <Button color="inherit" component={Link} href="/courses">
            Курсы
          </Button>
          <Button color="inherit" component={Link} href="/subjects">
            Предметы
          </Button>
          <Button color="inherit" component={Link} href="/materials">
            Материалы
          </Button>
          <Button color="inherit" component={Link} href="/profile">
            Профиль
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        </>
      );
    } else if (userInfo.roleId === 3) {
      // Студент
      return (
        <>
          <Button color="inherit" component={Link} href="/">
            Главная
          </Button>
          <Button color="inherit" component={Link} href="/courses">
            Курсы
          </Button>
          <Button color="inherit" component={Link} href="/progress">
            Прогресс
          </Button>
          <Button color="inherit" component={Link} href="/profile">
            Профиль
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        </>
      );
    } else {
      // Роль не определена
      return (
        <>
          <Button color="inherit" component={Link} href="/">
            Главная
          </Button>
          <Button color="inherit" component={Link} href="/login">
            Войти
          </Button>
        </>
      );
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Kazniisa LMS
        </Typography>
        {renderMenuByRole()}
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;