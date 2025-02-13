"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Next.js 13+
import { useDispatch, useSelector } from "react-redux";
import { getCourseByIdAction } from "@/store/slices/authSlice";


const DateFormatter = ({ isoDate }) => {
    const date = new Date(isoDate);
  
    const formattedDate = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  
    return <p>{formattedDate}</p>;
  };


export default function CourseDetail() {
  const { id } = useParams(); // Получаем id из URL
  const router = useRouter();
  const dispatch = useDispatch();
  // const course = useSelector((state) => state.auth.currentCourse);
  const loading = useSelector((state) => state.auth.loadingCourse);
  const error = useSelector((state) => state.auth.courseError);
  const thisCourse=useSelector((state) => state.auth.currentCourse);

  useEffect(() => {
    if (id) {
      dispatch(getCourseByIdAction(id)); // Загружаем курс
    }
  }, [id, dispatch]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  console.log('chosen course= ',thisCourse)
  return (
    <div>
          <li key={thisCourse.id}>
            <h2>{thisCourse.title}</h2>
            <p>{thisCourse.content}</p>
            <p>{thisCourse.description}</p>
           
            <p>  Курс создан <DateFormatter isoDate={thisCourse.created_at} /></p>
</li>


      <button onClick={() => router.push("/courses")}>Назад</button>
    </div>
  );
}
