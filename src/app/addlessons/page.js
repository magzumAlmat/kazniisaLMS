// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// const EditorJS = dynamic(() => import("@editorjs/editorjs").then(mod => mod.default), { ssr: false });

// const Header = dynamic(() => import("@editorjs/header"), { ssr: false });
// const List = dynamic(() => import("@editorjs/list"), { ssr: false });
// import {
//   Container,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   List as MuiList,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   IconButton,
//   Paper,
// } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";
// import { useSelector, useDispatch } from "react-redux";
// import TopMenu from "../../components/topmenu";
// import { logoutAction } from "../../store/slices/authSlice";
// import { useRouter } from "next/navigation";
// import "../style/base.css";


// import dynamic from "next/dynamic";
// // const EditorJS = dynamic(() => import("@editorjs/editorjs"), { ssr: false });
// // const Header = dynamic(() => import("@editorjs/header"), { ssr: false });
// // const List = dynamic(() => import("@editorjs/list"), { ssr: false });


// export default function LessonsPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [token, setToken] = useState(null);
//   const [lessons, setLessons] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState(null);
//   const [courseId, setCourseId] = useState("");
//   const [editingLesson, setEditingLesson] = useState(null);
//   const [userInfo, setUserInfo] = useState(null);
//   const editorInstance = useRef(null);
//   const host=process.env.NEXT_PUBLIC_HOST
//   const [initialContent, setInitialContent] = useState(null);
//   // Получение токена на стороне клиента
  
  
//   useEffect(() => {
//     const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     setToken(storedToken);
//     if (!storedToken) {
//       router.push("/login");
//     }
//   }, [router]);

//   // Инициализация данных
//   useEffect(() => {
//     if (token) {
//       fetchLessons();
//       fetchCourses();
//       fetchUserInfo();
//     }
//   }, [token]);

//   // Инициализация EditorJS
//  // В компоненте LessonsPage
// useEffect(() => {
//   if (!token) return;

//   if (!editorInstance.current) {
//     const editor = new EditorJS({
//       holder: "editorjs-lesson", // Уникальный ID контейнера
//       autofocus: true,
//       data: initialContent || content || { blocks: [] },
//       onChange: async () => {
//         const updatedContent = await editor.saver.save();
//         setContent(updatedContent);
//       },
//       tools: {
//         header: {
//           class: Header,
//           config: {
//             placeholder: "Enter a header",
//             levels: [1, 2, 3, 4],
//             defaultLevel: 1,
//           },
//         },
//         list: {
//           class: List,
//           inlineToolbar: true,
//           config: { defaultStyle: "unordered" },
//         },
//       },
//     });
//     editorInstance.current = editor;
//   }

//   return () => {
//     if (editorInstance.current) {
//       if (typeof editorInstance.current.destroy === 'function') {
//         editorInstance.current.destroy();
//       }
//       editorInstance.current = null;
//     }
//   };
// }, [token, initialContent]);


//   // Обновление содержимого при редактировании урока
//   // useEffect(() => {
//   //   if (editingLesson) {
//   //     const lesson = lessons.find(l => l.id === editingLesson);
//   //     if (lesson?.content) {
//   //       try {
//   //         const parsedContent = JSON.parse(lesson.content);
//   //         setInitialContent(parsedContent);
//   //       } catch (error) {
//   //         console.error("Ошибка при обработке содержимого:", error);
//   //       }
//   //     }
//   //   } else {
//   //     setInitialContent({ blocks: [] });
//   //   }
//   // }, [editingLesson, lessons]);
// // В useEffect при редактировании урока
// useEffect(() => {
//   if (editingLesson) {
//     const lesson = lessons.find(l => l.id === editingLesson);
//     if (lesson?.content) {
//       try {
//         const parsedContent = JSON.parse(lesson.content);
//         // Проверка структуры данных
//         if (parsedContent?.blocks) {
//           setInitialContent(parsedContent);
//           setContent(parsedContent);
//         } else {
//           setInitialContent({ blocks: [] });
//         }
//       } catch (error) {
//         console.error("Ошибка парсинга:", error);
//         setInitialContent({ blocks: [] });
//         setContent(null);
//       }
//     }
//   } else {
//     setInitialContent({ blocks: [] });
//   }
// }, [editingLesson, lessons]);


  
//   const fetchLessons = async () => {
//     try {
//       const response = await axios.get(`${host}/api/lessons`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLessons(response.data);
//     } catch (error) {
//       console.error("Ошибка при загрузке уроков:", error);
//       alert("Ошибка при загрузке уроков: " + error.message);
//     }
//   };

//   const fetchCourses = async () => {
//     try {
//       const response = await axios.get(`${host}/api/courses`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCourses(response.data);
//     } catch (error) {
//       console.error("Ошибка при загрузке курсов:", error);
//       alert("Ошибка при загрузке курсов: " + error.message);
//     }
//   };

//   const fetchUserInfo = async () => {
//     try {
//       const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUserInfo(response.data);
//     } catch (err) {
//       console.error("Ошибка при загрузке информации о пользователе:", err);
//       if (err.response && err.response.status === 401) {
//         router.push("/login");
//       }
//     }
//   };

//   const createLesson = async () => {
//     if (!courseId) {
//       alert("Выберите курс!");
//       return;
//     }
//     try {
//       const response = await axios.post(
//         `${host}/api/lessons`,
//         {
//           title,
//           content: JSON.stringify(content),
//           course_id: Number(courseId),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       setLessons([...lessons, response.data]);
//       resetForm();
//     } catch (error) {
//       console.error("Ошибка при создании урока:", error);
//       alert("Ошибка при создании урока: " + error.message);
//     }
//   };

//   const updateLesson = async (id) => {
//     try {
//       // Добавьте проверку содержимого
//       if (!content || !content.blocks || content.blocks.length === 0) {
//         alert("Содержимое урока не может быть пустым!");
//         return;
//       }
      
//       const response = await axios.put(
//         `${host}/api/lessons/${id}`,
//         {
//           title,
//           content: JSON.stringify(content),
//           course_id: Number(courseId),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
      
//       setLessons(lessons.map((lesson) => (lesson.id === id ? response.data : lesson)));
//       resetForm();
//     } catch (error) {
//       console.error("Ошибка при обновлении урока:", error);
//       alert("Ошибка при обновлении урока: " + error.message);
//     }
//   };

//   const deleteLesson = async (id) => {
//     try {
//       const response = await axios.delete(`${host}/api/lessons/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.status === 204) {
//         setLessons(lessons.filter((lesson) => lesson.id !== id));
//       }
//     } catch (error) {
//       console.error("Ошибка при удалении урока:", error);
//       alert("Ошибка при удалении урока: " + (error.response?.data?.error || error.message));
//     }
//   };

//   const resetForm = () => {
//     setEditingLesson(null);
//     setTitle("");
    
//     setCourseId("");
//     setContent({ blocks: [] });

//     if (editorInstance.current) {
//     // Используйте проверку метода
//     if (typeof editorInstance.current.render === 'function') {
//       editorInstance.current.render({ blocks: [] });
//     }
//   }
//   };

//   const handleLogout = () => {
//     dispatch(logoutAction());
//     localStorage.removeItem("token");
//     router.push("/login");
//   };

//   if (!token) {
//     return (
//       <Typography sx={{ textAlign: "center", mt: 4 }}>
//         Токен отсутствует. Пожалуйста, войдите в систему.
//       </Typography>
//     );
//   }
//   const EditorjsComponent = dynamic(
//     () => import('../../components/editorjscomponent'),
//     { ssr: false }
//   );


//   // useEffect(() => {
//   //     if (isEditorReady && data && editorRef.current) {
//   //       editorRef.current.render(data)
//   //         .catch(err => console.error('Ошибка обновления данных:', err));
//   //     }
//   //   }, [data, isEditorReady]);

//   return (
//     <>
//       <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
//       <Container maxWidth="md" sx={{ py: 4 }}>
//         <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
//           Управление уроками
//         </Typography>

//         <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
//           <Typography variant="h6">
//             {editingLesson ? "Редактировать урок" : "Создать новый урок"}
//           </Typography>
//           <TextField
//             fullWidth
//             label="Название урока"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             sx={{ mt: 2 }}
//           />

//           {/* {typeof window !== 'undefined' && ( */}
              
//           <EditorjsComponent data={editingLesson ? initialContent : content || { blocks: [] }} />
//           {/* <div id="editorjs-lesson" style={{ minHeight: '200px' }} /> */}
//           {/* <div id="editorjs" style={{ minHeight: '200px' }} /> */}
//             {/* )} */}

//           <FormControl fullWidth sx={{ mt: 2 }}>
//             <InputLabel>Выберите курс</InputLabel>
//             <Select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
//               {courses.map((course) => (
//                 <MenuItem key={course.id} value={course.id}>
//                   {course.title}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ mt: 2 }}
//             onClick={editingLesson ? () => updateLesson(editingLesson) : createLesson}
//           >
//             {editingLesson ? "Обновить урок" : "Добавить урок"}
//           </Button>
//         </Paper>
//         <MuiList>
//           {lessons.map((lesson) => (
//             <Paper key={lesson.id} elevation={3} sx={{ mb: 2 }}>
//               <ListItem>
//                 <ListItemText
//                   primary={lesson.title}
//                   secondary={`Курс: ${
//                     courses.find((course) => course.id === lesson.course_id)?.title || "Неизвестно"
//                   }`}
//                 />
//                 <ListItemSecondaryAction>
//                   <IconButton
//                     edge="end"
//                     aria-label="edit"
//                     color="primary"
//                     onClick={() => {
//                       setEditingLesson(lesson.id);
//                       setTitle(lesson.title);
//                       setContent(lesson.content ? JSON.parse(lesson.content) : null);
//                       setCourseId(lesson.course_id);
//                     }}
//                   >
//                     <Edit />
//                   </IconButton>
//                   <IconButton
//                     edge="end"
//                     aria-label="delete"
//                     color="error"
//                     onClick={() => deleteLesson(lesson.id)}
//                   >
//                     <Delete />
//                   </IconButton>
//                 </ListItemSecondaryAction>
//               </ListItem>
//             </Paper>
//           ))}
//         </MuiList>
//       </Container>
//     </>
//   );
// }




"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
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
  List as MuiList,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import TopMenu from "../../components/topmenu";
import { logoutAction } from "../../store/slices/authSlice";
import { useRouter } from "next/navigation";

// Динамический импорт Editor.js
const EditorJS = dynamic(
  () => import("@editorjs/editorjs").then((mod) => mod.default),
  { ssr: false }
);
const Header = dynamic(() => import("@editorjs/header").then((mod) => mod.default), {
  ssr: false,
});
const List = dynamic(() => import("@editorjs/list").then((mod) => mod.default), {
  ssr: false,
});

export default function LessonsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState({ blocks: [] });
  const [courseId, setCourseId] = useState("");
  const [editingLesson, setEditingLesson] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const editorInstance = useRef(null);
  const host = process.env.NEXT_PUBLIC_HOST;

  // Инициализация токена
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) router.push("/login");
  }, [router]);

  // Загрузка данных
  useEffect(() => {
    if (token) {
      fetchLessons();
      fetchCourses();
      fetchUserInfo();
    }
  }, [token]);

  // Инициализация Editor.js
  useEffect(() => {
    if (!token) return;
  
    const initEditor = async () => {
      try {
        const [EditorJS, Header, List] = await Promise.all([
          import("@editorjs/editorjs").then((mod) => mod.default),
          import("@editorjs/header").then((mod) => mod.default),
          import("@editorjs/list").then((mod) => mod.default),
        ]);
  
        // Уничтожаем предыдущий экземпляр, если он существует
        if (editorInstance.current?.destroy) {
          await editorInstance.current.destroy();
        }
  
        // Создаем новый экземпляр EditorJS
        const editor = new EditorJS({
          holder: "editorjs-container",
          tools: {
            header: { class: Header, config: { levels: [2, 3], defaultLevel: 2 } },
            list: { class: List, inlineToolbar: true },
          },
          placeholder: "Введите содержимое урока...",
          data: { blocks: [] }, // Начальные данные пустые
          onChange: async () => {
            const savedData = await editor.save();
            setContent(savedData);
          },
          logLevel: "ERROR",
        });
  
        editorInstance.current = editor;
      } catch (error) {
        console.error("Ошибка инициализации редактора:", error);
      }
    };
  
    initEditor();
  
    // Очистка при размонтировании
    return () => {
      if (editorInstance.current?.destroy) {
        editorInstance.current.destroy();
      }
    };
  }, [token]);
  
  // Отдельный useEffect для загрузки данных при редактировании
  useEffect(() => {
    if (!editorInstance.current || !editingLesson) return;
  
    const loadLessonData = async () => {
      const currentLesson = lessons.find((l) => l.id === editingLesson);
      const parsedContent = currentLesson?.content
        ? JSON.parse(currentLesson.content)
        : { blocks: [] };
  
      // Загружаем данные в редактор
      await editorInstance.current.render(parsedContent);
      setContent(parsedContent);
    };
  
    loadLessonData();
  }, [editingLesson, lessons]);

  // Загрузка уроков
  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${host}/api/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка загрузки уроков:", error);
    }
  };

  // Загрузка курсов
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${host}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Ошибка загрузки курсов:", error);
    }
  };

  // Загрузка данных пользователя
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке информации о пользователе:", err);
      if (err.response && err.response.status === 401) {
        router.push("/login");
      }
    }
  };


  // Начать редактирование урока
  const handleEdit = (lessonId) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setTitle(lesson.title);
      setCourseId(lesson.course_id.toString());
      setContent(lesson.content ? JSON.parse(lesson.content) : { blocks: [] });
      setEditingLesson(lessonId);
    }
  };

  // Удаление урока
  const handleDelete = async (lessonId) => {
    if (!window.confirm("Удалить урок?")) return;

    try {
      setIsLoading(true);
      await axios.delete(`${host}/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(lessons.filter((l) => l.id !== lessonId));
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка удаления урока:", error);
      setIsLoading(false);
    }
  };

  // Сохранение урока
  const handleSave = async () => {
    if (!editorInstance.current) return;
    if (!title || !courseId) return alert("Заполните все поля!");

    try {
      const savedContent = await editorInstance.current.save();
      setIsLoading(true);
      const requestData = {
        title,
        content: JSON.stringify(content),
        course_id: Number(courseId),
      };

      if (editingLesson) {
        // Обновление существующего урока
        const response = await axios.put(
          `${host}/api/lessons/${editingLesson}`,
          requestData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLessons(lessons.map((l) => (l.id === editingLesson ? response.data : l)));
        
      } 
      
      else {
        // Создание нового урока
        const response = await axios.post(`${host}/api/lessons`, requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLessons([...lessons, response.data]);
      }

      resetForm();
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка сохранения урока:", error);
      setIsLoading(false);
    }
  };

  // Сброс формы
  const resetForm = () => {
    setTitle("");
    setContent({ blocks: [] });
    setCourseId("");
    setEditingLesson(null);

    if (editorInstance.current?.clear) {
      editorInstance.current.clear();
    }
  };

  // Логаут
  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!token) return <Typography>Токен отсутствует</Typography>;

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {editingLesson ? "Редактировать урок" : "Создать урок"}
          </Typography>

          <TextField
            fullWidth
            label="Название урока"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Выберите курс</InputLabel>
            <Select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div id="editorjs-container" style={{ minHeight: "300px" }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="outlined" onClick={resetForm}>
              Очистить
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isLoading || !title || !courseId}
              startIcon={isLoading && <CircularProgress size={20} />}
            >
              {editingLesson ? "Обновить" : "Создать"}
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Список уроков
          </Typography>
          <MuiList>
            {lessons.map((lesson) => (
              <ListItem
                key={lesson.id}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      onClick={() => handleEdit(lesson.id)}
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(lesson.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={lesson.title}
                  secondary={`Курс: ${
                    courses.find((c) => c.id === lesson.course_id)?.title || "Неизвестный курс"
                  }`}
                />
              </ListItem>
            ))}
          </MuiList>
        </Paper>
      </Container>
    </>
  );
}