"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import jwtDecode from "jwt-decode";

import RawTool from "@editorjs/raw";
import SimpleImage from "@editorjs/simple-image";
import Checklist from "@editorjs/checklist";

import Embed from "@editorjs/embed";
import { getUserInfoAction } from "@/store/slices/authSlice";
import TopMenu from "@/components/topmenu";
import { useSelector,useDispatch } from "react-redux";

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null); // Содержимое Editor.js
  const [courseId, setCourseId] = useState("");
  const [editingLesson, setEditingLesson] = useState(null);
  const userInfo  = useSelector((state) => state.auth.currentUser);
  const dispatch=useDispatch()
  console.log('userInfo from slice= ',userInfo)
  const token = localStorage.getItem("token");
  const editorInstance = useRef(null);

  if (!token) {
    console.error("Token not available");
    return;
  }

  useEffect(() => {
    fetchLessons();
    fetchCourses();
    dispatch(getUserInfoAction())
    // Инициализация Editor.js при монтировании компонента
    

    if (editorInstance.current) {
      try {
        editorInstance.current.destroy();
      } catch (error) {
        console.warn("Ошибка при уничтожении предыдущего экземпляра Editor.js:", error);
      }
      editorInstance.current = null;
    }


    if (!editorInstance.current) {
      const editor = new EditorJS({
        holder: "editorjs", // ID контейнера для редактора
        autofocus: true,
        data: content || { blocks: [] }, // Начальные данные
        onChange: async () => {
          const updatedContent = await editor.saver.save(); // Получаем текущее содержимое
          setContent(updatedContent);
        },
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [1, 2, 3, 4],
              defaultLevel: 1
            }
          },
          raw: RawTool,
          image: SimpleImage,
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                coub: true,
              },
            },
          },
          quote: Quote,
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },}
      });
      editorInstance.current = editor;
    }

    return () => {
      // Очистка экземпляра Editor.js при размонтировании
      if (editorInstance.current) {
        try {
          editorInstance.current.destroy();
        } catch (error) {
          console.warn("Ошибка при уничтожении предыдущего экземпляра Editor.js:", error);
        }
        editorInstance.current = null;
      }

    };
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/lessons");
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
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

  const DEFAULT_INITIAL_DATA = {
    time: 1710221605695,
    blocks: [
      {
        id: "mhTl6ghSkV",
        type: "paragraph",
        data: {
          text: "Hey. Meet the new Editor. On this picture you can see it in action. Then, try a demo 🤓",
        },
      },
      {
        id: "l98dyx3yjb",
        type: "header",
        data: {
          text: "Key features",
          level: 3,
        },
      },
      {
        id: "os_YI4eub4",
        type: "list",
        data: {
          type: "unordered",
          items: [
            "It is a block-style editor",
            "It returns clean data output in JSON",
            'Designed to be extendable and pluggable with a <a href="https://editorjs.io/creating-a-block-tool">simple API</a>',
          ],
        },
      },
      {
        id: "1yKeXKxN7-",
        type: "header",
        data: {
          text: "What does it mean «block-styled editor»",
          level: 3,
        },
      },
      {
        id: "TcUNySG15P",
        type: "paragraph",
        data: {
          text: 'Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc. Each of them is an independent <sup data-tune="footnotes">1</sup> contenteditable element (or more complex structure) provided by Plugin and united by Editor"s Core.',
        },
        tunes: {
          footnotes: [
            "It works more stable then in other WYSIWYG editors. Same time it has smooth and well-known arrow navigation behavior like classic editors.",
          ],
        },
      },
      {
        id: "M3UXyblhAo",
        type: "header",
        data: {
          text: "What does it mean clean data output?",
          level: 3,
        },
      },
      {
        id: "KOcIofZ3Z1",
        type: "paragraph",
        data: {
          text: 'There are dozens of ready-to-use Blocks and a simple API <sup data-tune="footnotes">2</sup> for creating any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA buttons, and even games.',
        },
        tunes: {
          footnotes: [
            "Just take a look at our Creating Block Tool guide. You'll be surprised.",
          ],
        },
      },
      {
        id: "ksCokKAhQw",
        type: "paragraph",
        data: {
          text: 'Classic WYSIWYG editors produce raw HTML-markup with both content data and content appearance. On the contrary, <mark class="cdx-marker">Editor.js outputs JSON object</mark> with data of each Block.',
        },
      },
      {
        id: "XKNT99-qqS",
        type: "attaches",
        data: {
          file: {
            url: "https://drive.google.com/user/catalog/my-file.pdf",
            size: 12902,
            name: "file.pdf",
            extension: "pdf",
          },
          title: "My file",
        },
      },
      {
        id: "7RosVX2kcH",
        type: "paragraph",
        data: {
          text: "Given data can be used as you want: render with HTML for Web clients, render natively for mobile apps, create the markup for Facebook Instant Articles or Google AMP, generate an audio version, and so on.",
        },
      },
      {
        id: "eq06PsNsab",
        type: "paragraph",
        data: {
          text: "Clean data is useful to sanitize, validate and process on the backend.",
        },
      },
      {
        id: "hZAjSnqYMX",
        type: "image",
        data: {
          file: {
            url: "assets/codex2x.png",
          },
          withBorder: false,
          withBackground: false,
          stretched: true,
          caption: "CodeX Code Camp 2019",
        },
      },
    ],
  };
  
  // const initEditor = () => {
  //   const editor = new EditorJS({
  //     holder: "editorjs", 
  //     autofocus: true,
  //     data: content || { blocks: [] }, 
  //     onChange: async () => {
  //       const updatedContent = await editor.saver.save(); 
  //       setContent(updatedContent);
  //     },
  //     tools: {
  //       header: {
  //         class: Header,
  //         config: {
  //           placeholder: 'Enter a header',
  //           levels: [1, 2, 3, 4],
  //           defaultLevel: 1
  //         }
  //       },
  //       raw: RawTool,
  //       image: SimpleImage,
  //       checklist: {
  //         class: Checklist,
  //         inlineToolbar: true,
  //       },
  //       list: {
  //         class: List,
  //         inlineToolbar: true,
  //         config: {
  //           defaultStyle: 'unordered'
  //         }
  //       },
  //       embed: {
  //         class: Embed,
  //         config: {
  //           services: {
  //             youtube: true,
  //             coub: true,
  //           },
  //         },
  //       },
  //       quote: Quote,
  //       table: {
  //         class: Table,
  //         inlineToolbar: true,
  //         config: {
  //           rows: 2,
  //           cols: 3,
  //         },
  //       },}
  //   });
  //   editorInstance.current = editor;
  // };

  const createLesson = async () => {
    if (!courseId) {
      alert("Выберите курс!");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:4000/api/lessons",
        {
          title,
          content: JSON.stringify(content), // Преобразуем содержимое в JSON
          course_id: courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLessons([...lessons, response.data]);
      setTitle("");
      setContent(null);
      setCourseId("");
      editorInstance.current.clear(); // Очищаем редактор
    } catch (error) {
      console.error("Ошибка при создании урока:", error);
    }
  };

  const updateLesson = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/lessons/${id}`,
        {
          title,
          content: JSON.stringify(content), // Преобразуем содержимое в JSON
          course_id: courseId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setLessons(lessons.map((lesson) => (lesson.id === id ? response.data : lesson)));
      setEditingLesson(null);
      setTitle("");
      setContent(null);
      setCourseId("");
      editorInstance.current.clear(); // Очищаем редактор
    } catch (error) {
      console.error("Ошибка при обновлении урока:", error);
    }
  };

  const deleteLesson = async (id) => {
    console.log('delete id= ',id)
    try {
      await axios.delete(`http://localhost:4000/api/lessons/${id}`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        //   "Content-Type": "application/json",
        // },
      });
      setLessons(lessons.filter((lesson) => lesson.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении урока:", error);
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
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: "center" }}>
        Управление уроками
      </Typography>
      {/* Форма добавления/редактирования */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">
          {editingLesson ? "Редактировать урок" : "Создать новый урок"}
        </Typography>
        <TextField
          fullWidth
          label="Название урока"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 2 }}
        />
        {/* Editor.js */}
        <Box id="editorjs" sx={{ mt: 2, border: "1px solid #ccc", minHeight: "20px" }} />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Выберите курс</InputLabel>
          <Select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={editingLesson ? () => updateLesson(editingLesson) : createLesson}
        >
          {editingLesson ? "Обновить урок" : "Добавить урок"}
        </Button>
      </Paper>
      {/* Список уроков */}
      <MuiList>
        {lessons.map((lesson) => (
          <Paper key={lesson.id} elevation={3} sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText
                primary={lesson.title}
                secondary={`Курс: ${
                  courses.find((course) => course.id === lesson.course_id)?.title || "Неизвестно"
                }\n${lesson.content}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  color="primary"
                  onClick={() => {
                    setEditingLesson(lesson.id);
                    setTitle(lesson.title);
                    setContent(JSON.parse(lesson.content)); // Парсим содержимое из базы данных
                    setCourseId(lesson.course_id);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  color="error"
                  onClick={() => deleteLesson(lesson.id)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        ))}
      </MuiList>
    </Container>
    </>
  );
}