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
  Paper,ListItemSecondaryAction,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import jwtDecode from "jwt-decode";
import { useDropzone } from "react-dropzone";
import { getUserInfoAction } from "@/store/slices/authSlice";
import TopMenu from "@/components/topmenu";
import { useSelector,useDispatch } from "react-redux";
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
  const [courses, setCourses] = useState([]);
  const [testFilePath, setTestFilePath] = useState("");
  const [userInfo, setUserInfo] = useState(null); // Инициализируем как null
  const dispatch=useDispatch()
  console.log('userInfo from slice= ',userInfo)
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
    fetchCourses();
    fetchUserInfo()
  }, []);

  const fetchUserInfo = async () => {
    // console.log('fetchUserInfo started!')
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:4000/api/auth/getAuthentificatedUserInfo",
      {headers: {
        'Authorization': `Bearer ${token}`,
      }
      },);
      setUserInfo(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
      
    }
  };
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

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке курсов:", error);
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
      }else if (type === "test" && testFilePath.trim() === "") {
        alert("Введите ссылку на тест!");
        return;
      }

      const materialResponse = await axios.post(
        "http://localhost:4000/api/materials",
        {
          title,
          type,
          file_path: type === "test" ? testFilePath : uploadedFileResponse?.data.newFile.path,
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
      setTestFilePath("");
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

  const handleLogout = () => {
    console.log('HandleLogout called');
    dispatch(logoutAction());
    localStorage.removeItem('token');
    router.push('/login');
  };

return (
  <>
  <TopMenu handleLogout={handleLogout}  userInfo={userInfo} />
    <Container>
      <Box mt={4}>
        <Typography variant="h4">Управление материалами</Typography>
  
        {/* Форма добавления/редактирования */}
        <Box mt={4}>
          <Typography variant="h6">{editingMaterial ? "Редактировать материал" : "Создать новый материал"}</Typography>
          <TextField
            label="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 2 }}
            fullWidth
            required
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Тип материала</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="video">Видео</MenuItem>
              <MenuItem value="document">Документ</MenuItem>
              <MenuItem value="presentation">Презентация</MenuItem>
              <MenuItem value="test">Ссылка на тест</MenuItem>
            </Select>
          </FormControl>
  
          {/* Dropzone для видео */}
          {type === "video" && (
            <Box mt={2}>
              <div {...getVideoRootProps()}>
                <input {...getVideoInputProps()} />
                <Typography>Перетащите файл сюда или нажмите для выбора</Typography>
              </div>
              {files.length > 0 && <Typography>Выбранный файл: {files[0].name}</Typography>}
            </Box>
          )}
  
          {/* Dropzone для документов */}
          {type === "document" && (
            <Box mt={2}>
              <div {...getDocumentRootProps()}>
                <input {...getDocumentInputProps()} />
                <Typography>Перетащите документ сюда или нажмите для выбора</Typography>
              </div>
              {documentFiles.length > 0 && <Typography>Выбранный файл: {documentFiles[0].name}</Typography>}
            </Box>
          )}
  
          {/* Dropzone для презентаций */}
          {type === "presentation" && (
            <Box mt={2}>
              <div {...getPresentationRootProps()}>
                <input {...getPresentationInputProps()} />
                <Typography>Перетащите презентацию сюда или нажмите для выбора</Typography>
              </div>
              {presentationFiles.length > 0 && <Typography>Выбранный файл: {presentationFiles[0].name}</Typography>}
            </Box>
          )}

          {type === "test" && (
            <TextField
              label="Ссылка на тест"
              value={testFilePath}
              onChange={(e) => setTestFilePath(e.target.value)}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
          )}
  
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Выберите урок</InputLabel>
            <Select
              value={lesson_id}
              onChange={(e) => setLessonId(e.target.value)}
              fullWidth
              required
            >
              {lessons.map((lesson) => {
                const course = courses.find((c) => c.id === lesson.course_id);
                return (
                  <MenuItem key={lesson.id} value={lesson.id}>
                    {course ? course.title : 'Курс не найден'} - {lesson.title}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
  
          <Button
            variant="contained"
            color="primary"
            onClick={createMaterial}
            sx={{ mt: 2 }}
          >
            {editingMaterial ? "Обновить материал" : "Добавить материал"}
          </Button>
        </Box>
  
        {/* Список материалов */}
        <Box mt={4}>
          <Typography variant="h5">Список материалов</Typography>
          <ul>
            {materials.map((material) => (
              <ListItem key={material.material_id}>
                <ListItemText
                  primary={`${material.title}`}
                  secondary={`Урок: ${lessons.find((lesson) => lesson.id === material.lesson_id)?.title || "Неизвестно"}\nТип: ${material.type}\nФайл: ${material.file_path}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
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
                    onClick={() => deleteMaterial(material.material_id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </ul>
        </Box>
      </Box>
    </Container>
    </>
  );
}