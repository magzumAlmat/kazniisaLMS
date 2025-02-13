"use client";

import React from "react";
import { Container, Box, AppBar, Toolbar, Typography, Button, Paper } from "@mui/material";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Верхнее меню */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Учебная платформа
          </Typography>
          <Button color="inherit" component={Link} href="/layout">Главная</Button>
          <Button color="inherit" component={Link} href="/courses">Курсы</Button>
          <Button color="inherit" component={Link} href="/profile">Профиль</Button>
        </Toolbar>
      </AppBar>

      {/* Основной контейнер */}
      <Container maxWidth="md" sx={{ mt: 3, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, border: "1px solid #ddd" }}>
          {children}
        </Paper>
      </Container>

      {/* Футер */}
      <Box component="footer" sx={{ textAlign: "center", p: 2, bgcolor: "#f5f5f5", mt: 3 }}>
        <Typography variant="body2">© 2025 Учебная платформа. Все права защищены.</Typography>
      </Box>
    </Box>
  );
}
