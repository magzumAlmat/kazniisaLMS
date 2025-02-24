"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import jwtDecode from "jwt-decode";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("video"); // Добавляем тип материала
  const [filePath, setFilePath] = useState(""); // Путь к файлу
  const [lesson_id, setLessonId] = useState(""); // ID урока
  const [editingMaterial, setEditingMaterial] = useState(null);

  const token = localStorage.getItem("token");

  console.log("2 userTokenINITZ token=", token);

  let decodedToken = jwtDecode(token);
  console.log("3 getUsersPosts decoded=", decodedToken.username);

  if (!token) {
    console.error("Token not available");
    return;
  }

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchMaterials();
    fetchLessons();
  }, []);

  
  // Получение всех материалов
  const fetchMaterials = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/materials", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMaterials(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке материалов:", error);
    }
  };


  // Получение всех уроков
  const fetchLessons = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/lessons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
    }
  };

  // Создание нового материала
  const createMaterial = async () => {
    if (!title || !type || !filePath || !lesson_id) {
      alert("Заполните все поля!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:4000/api/materials",
        {
          title,
          type,
          file_path: filePath,
          lesson_id: Number(lesson_id), // Преобразуем lesson_id в число
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMaterials([...materials, response.data]); // Добавляем новый материал в список
      setTitle("");
      setType("video");
      setFilePath("");
      setLessonId("");
    } catch (error) {
      console.error("Ошибка при создании материала:", error);
    }
  };

  // Обновление существующего материала
  const updateMaterial = async () => {
    if (!editingMaterial || !title || !type || !filePath || !lesson_id) {
      alert("Заполните все поля!");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:4000/api/materials/${editingMaterial}`,
        {
          title,
          type,
          file_path: filePath,
          lesson_id: Number(lesson_id), // Преобразуем lesson_id в число
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMaterials(
        materials.map((material) =>
          material.id === editingMaterial ? response.data : material
        )
      ); // Обновляем материал в списке
      setEditingMaterial(null);
      setTitle("");
      setType("video");
      setFilePath("");
      setLessonId("");
    } catch (error) {
      console.error("Ошибка при обновлении материала:", error);
    }
  };

  // Удаление материала
  const deleteMaterial = async (material_id) => {
    console.log("removing id= ", material_id);
    try {
      await axios.delete(`http://localhost:4000/api/materials/${material_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMaterials(materials.filter((material) => material.material_id !== material_id)); // Удаляем материал из списка
    } catch (error) {
      console.error("Ошибка при удалении материала:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: "center" }}>
        Управление материалами
      </Typography>
      {/* Форма добавления/редактирования */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">
          {editingMaterial ? "Редактировать материал" : "Создать новый материал"}
        </Typography>
        <TextField
          fullWidth
          label="Название материала"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 2 }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Тип материала</InputLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <MenuItem value="video">Видео</MenuItem>
            <MenuItem value="document">Документ</MenuItem>
            <MenuItem value="presentation">Презентация</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Путь к файлу"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          sx={{ mt: 2 }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Выберите урок</InputLabel>
          <Select value={lesson_id} onChange={(e) => setLessonId(e.target.value)}>
            {lessons.map((les) => (
              <MenuItem key={les.id} value={les.id}>
                {les.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={editingMaterial ? updateMaterial : createMaterial}
        >
          {editingMaterial ? "Обновить материал" : "Добавить материал"}
        </Button>
      </Paper>
      {/* Список материалов */}
      <List>
        {materials.map((material) => (
          console.log('this is material',material),
          <Paper key={material.material_id} elevation={3} sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText
                primary={material.title}
                secondary={`Урок: ${
                  lessons.find((lesson) => lesson.id === material.lesson_id)?.title || "Неизвестно"
                }\nТип: ${material.type}\nФайл: ${material.file_path}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  color="primary"
                  onClick={() => {
                    setEditingMaterial(material.material_id);
                    setTitle(material.title);
                    setType(material.type);
                    setFilePath(material.file_path);
                    setLessonId(material.lesson_id.toString());
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  color="error"
                  onClick={() => deleteMaterial(material.material_id)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Container>
  );
}