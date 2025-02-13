"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingCourse, setEditingCourse] = useState(null); // ID редактируемого курса

  // Получаем все курсы при загрузке
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке курсов:", error);
    }
  };

  // Создание нового курса
  const createCourse = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/courses", { title, description });
      setCourses([...courses, response.data]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Ошибка при создании курса:", error);
    }
  };

  // Обновление курса
  const updateCourse = async (id) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/courses/${id}`, {
        title,
        description,
      });
      setCourses(courses.map(course => (course.id === id ? response.data : course)));
      setEditingCourse(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Ошибка при обновлении курса:", error);
    }
  };

  // Удаление курса
  const deleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/courses${id}`);
      setCourses(courses.filter((course) => course.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении курса:", error);
    }
  };

  return (
    <div>
      <h1>Управление курсами</h1>

      {/* Форма для добавления/редактирования курса */}
      <div>
        <h2>{editingCourse ? "Редактировать курс" : "Создать новый курс"}</h2>
        <input
          type="text"
          placeholder="Название курса"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Описание курса"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={editingCourse ? () => updateCourse(editingCourse) : createCourse}>
          {editingCourse ? "Обновить курс" : "Добавить курс"}
        </button>
      </div>

      {/* Список курсов */}
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <button onClick={() => {
              setEditingCourse(course.id);
              setTitle(course.title);
              setDescription(course.description);
            }}>
              Редактировать
            </button>
            <button onClick={() => deleteCourse(course.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
