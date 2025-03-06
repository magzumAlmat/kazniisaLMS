"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const host = process.env.NEXT_PUBLIC_HOST;

  useEffect(() => {
    if (!token) {
      setError("Токен отсутствует. Пожалуйста, используйте ссылку из письма.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(`${host}/api/reset-password`, { token, newPassword });
      setMessage(response.data.message);
      setTimeout(() => router.push("/login"), 2000); // Перенаправление на логин через 2 сек
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка при сбросе пароля");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Сброс пароля
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Новый пароль"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading || !token}
        >
          {loading ? <CircularProgress size={24} /> : "Сохранить"}
        </Button>
      </form>
      {message && <Typography color="success.main" sx={{ mt: 2 }}>{message}</Typography>}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
}