"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../../public/logo.png"; // Импорт логотипа

const TopMenu = ({ userInfo, handleLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const renderMenuByRole = () => {
    if (!userInfo) return [];

    const menuItems = {
      1: [
        { text: "Главная", href: "/layout" },
        { text: "Добавить роль", href: "/addrole" },
        { text: "Профиль", href: "/profile" },
        { text: "Выйти", onClick: handleLogout },
      ],
      2: [
        { text: "Главная", href: "/layout" },
        { text: "Потоки", href: "/addstreams" },
        { text: "Курсы", href: "/addcourse" },
        { text: "Предметы", href: "/addlessons" },
        { text: "Материалы", href: "/addmaterial" },
        { text: "Прогресс", href: "/progressstatus" },
        { text: "Профиль", href: "/profile" },
        { text: "Выйти", onClick: handleLogout },
      ],
      3: [
        { text: "Главная", href: "/layout" },
        { text: "Курсы", href: "/courses" },
        { text: "Профиль", href: "/profile" },
        { text: "Выйти", onClick: handleLogout },
      ],
    };

    return menuItems[userInfo.roleId] || [
      { text: "Главная", href: "/notauth" },
      { text: "Профиль", href: "/profile" },
      { text: "Выйти", onClick: handleLogout },
    ];
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerMenu = (
    <Box sx={{ width: 250, bgcolor: "#fff" }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {renderMenuByRole().map((item, index) => (
          <ListItem
            key={index}
            component={item.href ? Link : "button"}
            href={item.href}
            onClick={item.onClick}
            sx={{ color: "#000" }} // Чёрный текст в боковом меню
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#fff", // Белый фон меню
          borderBottom: "2px solid #1565c0", // Синяя граница сохраняется
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Лёгкая тень для глубины
        }}
      >
        <Toolbar
          sx={{
            flexWrap: "wrap",
            justifyContent: { xs: "space-between", sm: "space-between" },
            py: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "#000", fontSize: { xs: "1rem", sm: "1.25rem" }, display: "flex", alignItems: "center" }}
          >
            <Box
              component="img"
              src={logo.src} // Используем logo.src для корректной ссылки
              alt="Logo"
              sx={{ height: { xs: 30, sm: 40 }, mr: 1 }} // Размер логотипа и отступ справа
            />
            {/* Можно добавить текст рядом с логотипом, если нужно */}
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: { xs: 1, sm: 2, md: 3 }, flexWrap: "wrap" }}>
            {renderMenuByRole().map((item, index) => (
              <Button
                key={index}
                color="inherit"
                component={item.href ? Link : "button"}
                href={item.href}
                onClick={item.onClick}
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                  px: { xs: 1, sm: 2 },
                  minWidth: "auto",
                  color: "#000", // Чёрный текст кнопок
                  "&:hover": { bgcolor: "#f5f5f5" }, // Лёгкий серый фон при наведении
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
          <IconButton
            edge="end"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: "block", sm: "none" }, color: "#000" }} // Чёрная иконка меню
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerMenu}
      </Drawer>
    </>
  );
};

export default TopMenu;