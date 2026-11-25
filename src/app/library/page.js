"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../store/slices/authSlice";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Divider,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import TopMenu from "../../components/topmenu";
import { useRouter } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981", // Emerald 500
      contrastText: "#fff",
    },
    secondary: {
      main: "#3b82f6", // Blue 500
    },
    background: {
      default: "#1f2937", // Gray 800
      paper: "#374151", // Gray 700
    },
    text: {
      primary: "#ffffff",
      secondary: "#d1d5db",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: { fontWeight: 600 },
    h6: { fontWeight: 500 },
    body2: { fontWeight: 400 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 600,
        },
      },
    },
  },
});

const DOCUMENTS = [
  {
    id: 1,
    title: "СТ РК ISO 19650-1-2019",
    subtitle: "Организация информации о строительных работах (BIM) — Часть 1: Понятия и принципы (ҚР СТ ISO 19650-1-2019)",
    category: "Стандарты",
    fileName: "ST_RK_ISO_19650-1-2019.pdf",
    fileSize: "2.1 MB",
    description: "Государственный стандарт Республики Казахстан. Включает казахскую и русскую версии стандарта.",
  },
  {
    id: 2,
    title: "СТ РК ISO 19650-2-2019",
    subtitle: "Организация информации о строительных работах (BIM) — Часть 2: Этап создания активов (ҚР СТ ISO 19650-2-2019)",
    category: "Стандарты",
    fileName: "ST_RK_ISO_19650-2-2019.pdf",
    fileSize: "0.9 MB",
    description: "Государственный стандарт Республики Казахстан. Требования к процессу управления информацией при реализации активов.",
  },
  {
    id: 3,
    title: "ISO 19650-1:2018 (EN)",
    subtitle: "Organization and digitization of information about buildings and civil engineering works (BIM) — Part 1: Concepts and principles",
    category: "Стандарты",
    fileName: "ISO_19650-1_2018_en.pdf",
    fileSize: "2.2 MB",
    description: "Оригинальный международный стандарт ISO 19650-1 на английском языке.",
  },
  {
    id: 4,
    title: "ISO 19650-2:2018 (EN)",
    subtitle: "Organization and digitization of information about buildings and civil engineering works (BIM) — Part 2: Delivery phase of the assets",
    category: "Стандарты",
    fileName: "ISO_19650-2_2018_en.pdf",
    fileSize: "7.8 MB",
    description: "Оригинальный международный стандарт ISO 19650-2 на английском языке.",
  },
  {
    id: 5,
    title: "Global openBIM Mandates (2025 Edition)",
    subtitle: "buildingSMART International — A Playbook of openBIM Mandates from Around the World",
    category: "Руководства openBIM",
    fileName: "IFC-Mandate_2025.pdf",
    fileSize: "1.7 MB",
    description: "Мировой обзор и практическое руководство по государственным мандатам и требованиям openBIM / IFC (издание 2025 г.).",
  },
  {
    id: 6,
    title: "Guidance for Regulators on use of openBIM (Nov 2024)",
    subtitle: "buildingSMART International — Industry Insight",
    category: "Руководства openBIM",
    fileName: "Guidance_for_Regulators_Industry_Insight_bSI.pdf",
    fileSize: "3.5 MB",
    description: "Руководство для органов государственного регулирования и экспертизы по применению openBIM стандартов.",
  },
  {
    id: 7,
    title: "EU BIM Task Group: Handbook for Public Sector",
    subtitle: "Handbook for the introduction of Building Information Modelling by the European Public Sector",
    category: "Руководства openBIM",
    fileName: "EUBIM_Handbook.pdf",
    fileSize: "3.3 MB",
    description: "Европейское практическое руководство по внедрению BIM-технологий в государственном секторе.",
  },
  {
    id: 8,
    title: "Methodology Handbook: BIM in Public Tenders (2021)",
    subtitle: "European Commission — Calculating Costs and Benefits for the use of BIM in Public Tenders",
    category: "Руководства openBIM",
    fileName: "Handbook_BIM_Public_Tenders.pdf",
    fileSize: "6.9 MB",
    description: "Методика Европейской комиссии по расчету экономической эффективности, затрат и выгод применения BIM в закупках.",
  },
  {
    id: 9,
    title: "Reinventing Construction: A route to higher productivity",
    subtitle: "McKinsey Global Institute (February 2017)",
    category: "Исследования и отчеты",
    fileName: "McKinsey_Reinventing_Construction_2017.pdf",
    fileSize: "4.7 MB",
    description: "Фундаментальный аналитический отчет McKinsey о путях кардинального повышения производительности в строительной отрасли.",
  },
  {
    id: 10,
    title: "From start-up to scale-up: Construction Technology",
    subtitle: "McKinsey & Company (May 2023) — Accelerating growth in construction technology",
    category: "Исследования и отчеты",
    fileName: "McKinsey_From_start_up_to_scale_up_2023.pdf",
    fileSize: "1.0 MB",
    description: "Исследование рынка строительных технологий (ConTech): инвестиции, тренды и факторы роста.",
  },
  {
    id: 11,
    title: "Industry Survey: Role of BIM and CDEs (2022)",
    subtitle: "buildingSMART International — Understanding the role of BIM and CDEs Today and Expectations for the Future",
    category: "Исследования и отчеты",
    fileName: "Survey_the_role_of_BIM_and_what_the_future_holds.pdf",
    fileSize: "1.7 MB",
    description: "Результаты всемирного опроса специалистов о среде общих данных (CDE) и роли информационного моделирования.",
  },
  {
    id: 12,
    title: "2024 Technology Report: AI in Construction",
    subtitle: "On-Site Magazine & Buildots (February 2024)",
    category: "Искусственный интеллект",
    fileName: "Technology_Report_2024.pdf",
    fileSize: "1.5 MB",
    description: "Практический отчет об интеграции технологий искусственного интеллекта и машинного зрения в строительстве.",
  },
  {
    id: 13,
    title: "Transforming Construction with AI",
    subtitle: "Briq Whitepaper — Financial Automation and Predictive Analytics",
    category: "Искусственный интеллект",
    fileName: "Transforming_construction_with_AI.pdf",
    fileSize: "0.2 MB",
    description: "Обзор применения AI-автоматизации и прогнозной аналитики для управления строительными проектами и бюджетами.",
  },
];

const CATEGORIES = ["Все", "Стандарты", "Руководства openBIM", "Исследования и отчеты", "Искусственный интеллект"];

export default function LibraryPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");

  const dispatch = useDispatch();
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_HOST || "https://lms.kazniisa.kz";

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке информации о пользователе:", error);
      if (error.response && error.response.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  const filteredDocuments = useMemo(() => {
    return DOCUMENTS.filter((doc) => {
      const matchesCategory =
        selectedCategory === "Все" || doc.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.subtitle.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.fileName.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!token || loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: theme.palette.background.default,
          }}
        >
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh" }}>
        <TopMenu userInfo={userInfo} handleLogout={handleLogout} />

        <Box sx={{ py: { xs: 3, md: 5 } }}>
          <Container maxWidth="lg">
            {/* Header section */}
            <Paper
              elevation={2}
              sx={{
                p: { xs: 3, md: 4 },
                mb: 4,
                bgcolor: theme.palette.background.paper,
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Box
                  sx={{
                    bgcolor: "rgba(16, 185, 129, 0.15)",
                    p: 1.5,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MenuBookIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.5rem", md: "2rem" },
                      color: "#fff",
                    }}
                  >
                    Электронная библиотека
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Нормативно-техническая документация, международные стандарты ISO, руководства openBIM и аналитические материалы.
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />

              {/* Search & filters */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Поиск по названию стандарта, темы или автору..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#9ca3af" }} />
                      </InputAdornment>
                    ),
                    sx: {
                      bgcolor: "#1f2937",
                      color: "#fff",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                      "&:hover fieldset": { borderColor: theme.palette.primary.main },
                      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                    },
                  }}
                />

                <Box sx={{ overflowX: "auto" }}>
                  <Stack direction="row" spacing={1} sx={{ minWidth: "max-content", pt: 1 }}>
                    {CATEGORIES.map((cat) => (
                      <Chip
                        key={cat}
                        label={cat}
                        clickable
                        onClick={() => setSelectedCategory(cat)}
                        sx={{
                          fontWeight: 500,
                          bgcolor: selectedCategory === cat ? theme.palette.primary.main : "#1f2937",
                          color: selectedCategory === cat ? "#fff" : "#d1d5db",
                          border: "1px solid",
                          borderColor:
                            selectedCategory === cat ? theme.palette.primary.main : "rgba(255, 255, 255, 0.15)",
                          "&:hover": {
                            bgcolor: selectedCategory === cat ? "#059669" : "#374151",
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Paper>

            {/* Documents List */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {filteredDocuments.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    bgcolor: theme.palette.background.paper,
                    borderRadius: "12px",
                  }}
                >
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                    Документы по вашему запросу не найдены.
                  </Typography>
                </Paper>
              ) : (
                filteredDocuments.map((doc) => {
                  const downloadUrl = `${host}/uploads/library/${doc.fileName}`;
                  return (
                    <Paper
                      key={doc.id}
                      elevation={1}
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        bgcolor: theme.palette.background.paper,
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          justifyContent: "space-between",
                          gap: 2,
                        }}
                      >
                        {/* Left Side: Icon + Details */}
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5, flex: 1 }}>
                          <Box
                            sx={{
                              bgcolor: "rgba(239, 68, 68, 0.15)",
                              borderRadius: "10px",
                              p: 1.5,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              mt: 0.5,
                            }}
                          >
                            <PictureAsPdfIcon sx={{ color: "#ef4444", fontSize: 32 }} />
                          </Box>

                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.75 }}>
                              <Typography
                                variant="h6"
                                component="h2"
                                sx={{
                                  fontSize: { xs: "1rem", md: "1.15rem" },
                                  fontWeight: 600,
                                  color: "#ffffff",
                                }}
                              >
                                {doc.title}
                              </Typography>
                              <Chip
                                label={doc.category}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(16, 185, 129, 0.12)",
                                  color: theme.palette.primary.main,
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                  border: "1px solid rgba(16, 185, 129, 0.3)",
                                }}
                              />
                              <Chip
                                label={doc.fileSize}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(255, 255, 255, 0.08)",
                                  color: "#9ca3af",
                                  fontSize: "0.75rem",
                                }}
                              />
                            </Box>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#9ca3af",
                                mb: 0.5,
                                fontSize: "0.875rem",
                                lineHeight: 1.4,
                              }}
                            >
                              {doc.subtitle}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#d1d5db",
                                fontSize: "0.825rem",
                              }}
                            >
                              {doc.description}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Right Side: Download Button */}
                        <Box
                          sx={{
                            alignSelf: { xs: "stretch", sm: "center" },
                            flexShrink: 0,
                            pl: { sm: 2 },
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            component="a"
                            href={downloadUrl}
                            download={doc.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<FileDownloadIcon />}
                            sx={{
                              width: { xs: "100%", sm: "auto" },
                              px: 3,
                              py: 1.2,
                              fontSize: "0.95rem",
                              fontWeight: 600,
                              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                              "&:hover": {
                                bgcolor: "#059669",
                              },
                            }}
                          >
                            Скачать
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  );
                })
              )}
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
