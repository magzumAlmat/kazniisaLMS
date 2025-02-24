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
  IconButton,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import jwtDecode from "jwt-decode";
import { useDropzone } from "react-dropzone";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("video");
  const [filePath, setFilePath] = useState("");
  const [lesson_id, setLessonId] = useState("");
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [files, setFiles] = useState([]); // Для видео
  const [documentFiles, setDocumentFiles] = useState([]); // Для документов
  const [presentationFiles, setPresentationFiles] = useState([]); // Для презентаций
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token not available");
    return;
  }

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    accept: "video/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const { getRootProps: getDocumentRootProps, getInputProps: getDocumentInputProps } = useDropzone({
    accept: "*/*", // Принимаем все форматы файлов
    onDrop: (acceptedFiles) => {
      setDocumentFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const { getRootProps: getPresentationRootProps, getInputProps: getPresentationInputProps } = useDropzone({
    accept: "*/*", // Принимаем все форматы файлов
    onDrop: (acceptedFiles) => {
      setPresentationFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    fetchMaterials();
    fetchLessons();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/materials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке материалов:", error);
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/lessons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
    }
  };

  const createMaterial = async () => {
    if (!title || !type || (type === "video" && files.length === 0) || !lesson_id) {
      alert("Заполните все поля и выберите файл!");
      return;
    }

    try {
      let uploadedFileResponse = null;

      if (type === "video") {
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("name", title);

        uploadedFileResponse = await axios.post("http://localhost:4000/api/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (type === "document") {
        const formData = new FormData();
        formData.append("file", documentFiles[0]);
        formData.append("name", title);

        uploadedFileResponse = await axios.post("http://localhost:4000/api/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (type === "presentation") {
        const formData = new FormData();
        formData.append("file", presentationFiles[0]);
        formData.append("name", title);

        uploadedFileResponse = await axios.post("http://localhost:4000/api/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      const materialResponse = await axios.post(
        "http://localhost:4000/api/materials",
        {
          title,
          type,
          file_path: uploadedFileResponse?.data.newFile.path,
          lesson_id: Number(lesson_id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMaterials([...materials, materialResponse.data]);
      setTitle("");
      setType("video");
      setFilePath("");
      setLessonId("");
      setFiles([]);
      setDocumentFiles([]);
      setPresentationFiles([]);
    } catch (error) {
      console.error("Ошибка при создании материала:", error);
    }
  };

  const deleteMaterial = async (material_id) => {
    try {
      await axios.delete(`http://localhost:4000/api/materials/${material_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(materials.filter((material) => material.material_id !== material_id));
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
  
        {/* Dropzone для видео */}
        {type === "video" && (
          <Box {...getVideoRootProps()} sx={{ mt: 2, border: "2px dashed #ccc", p: 2, textAlign: "center" }}>
            <input {...getVideoInputProps()} />
            <Typography>Перетащите файл сюда или нажмите для выбора</Typography>
            {files.length > 0 && (
              <Typography variant="body2">Выбранный файл: {files[0].name}</Typography>
            )}
          </Box>
        )}
  
        {/* Dropzone для документов */}
        {type === "document" && (
          <Box {...getDocumentRootProps()} sx={{ mt: 2, border: "2px dashed #ccc", p: 2, textAlign: "center" }}>
            <input {...getDocumentInputProps()} />
            <Typography>Перетащите документ сюда или нажмите для выбора</Typography>
            {documentFiles.length > 0 && (
              <Typography variant="body2">Выбранный файл: {documentFiles[0].name}</Typography>
            )}
          </Box>
        )}
  
        {/* Dropzone для презентаций */}
        {type === "presentation" && (
          <Box {...getPresentationRootProps()} sx={{ mt: 2, border: "2px dashed #ccc", p: 2, textAlign: "center" }}>
            <input {...getPresentationInputProps()} />
            <Typography>Перетащите презентацию сюда или нажмите для выбора</Typography>
            {presentationFiles.length > 0 && (
              <Typography variant="body2">Выбранный файл: {presentationFiles[0].name}</Typography>
            )}
          </Box>
        )}
  
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
          onClick={createMaterial}
        >
          {editingMaterial ? "Обновить материал" : "Добавить материал"}
        </Button>
      </Paper>
  
      {/* Список материалов */}
      <List >
        {materials.map((material) => (
          <Paper key={material.material_id} elevation={3} sx={{ mb: 2 }}>
            <ListItem
              secondaryAction={
                <>
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
                </>
              }
            >
              <ListItemText
                primary={material.title}
                secondary={`Урок: ${
                  lessons.find((lesson) => lesson.id === material.lesson_id)?.title || "Неизвестно"
                }\nТип: ${material.type}\nФайл: ${material.file_path}`}
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Container>
  );
}