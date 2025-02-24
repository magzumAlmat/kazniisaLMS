"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesAction } from "@/store/slices/authSlice";
import { Card, CardContent, CardActions, Button, Typography, Container, Grid, CircularProgress, Box } from "@mui/material";
import Link from "next/link";

export default function Courses() {
  const dispatch = useDispatch();
  const { courses, loadingCourses, coursesError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllCoursesAction());
  }, [dispatch]);

  if (loadingCourses) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (coursesError) {
    return <Typography variant="h6" color="error">Ошибка: {coursesError}</Typography>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}>
        Доступные курсы
      </Typography>

      {courses.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center">
          Нет доступных курсов.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.description || "Описание отсутствует."}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    href={`/courses/${course.id}`}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Перейти к курсу
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}