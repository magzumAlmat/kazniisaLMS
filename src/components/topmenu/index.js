"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const TopMenu = ({ userInfo, handleLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t, ready } = useTranslation();

  const renderMenuByRole = () => {
    if (!userInfo) return [];

    const menuItems = {
      1: [
        { text: t("topMenu.home"), href: "/layout" },
        { text: t("topMenu.addRole"), href: "/addrole" },
        { text: t("topMenu.profile"), href: "/profile" },
        { text: t("topMenu.logout"), onClick: handleLogout },
      ],
      2: [
        { text: t("topMenu.home"), href: "/layout" },
        { text: t("topMenu.streams"), href: "/addstreams" },
        { text: t("topMenu.courses"), href: "/addcourse" },
        { text: t("topMenu.lessons"), href: "/addlessons" },
        { text: t("topMenu.materials"), href: "/addmaterial" },
        { text: t("topMenu.progress"), href: "/progressstatus" },
        { text: t("topMenu.profile"), href: "/profile" },
        { text: t("topMenu.logout"), onClick: handleLogout },
      ],
      3: [
        { text: t("topMenu.home"), href: "/layout" },
        { text: t("topMenu.courses"), href: "/courses" },
        { text: t("topMenu.profile"), href: "/profile" },
        { text: t("topMenu.logout"), onClick: handleLogout },
      ],
    };

    return (
      menuItems[userInfo.roleId] || [
        { text: t("topMenu.home"), href: "/notauth" },
        { text: t("topMenu.profile"), href: "/profile" },
        { text: t("topMenu.logout"), onClick: handleLogout },
      ]
    );
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerMenu = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {renderMenuByRole().map((item, index) => (
          <ListItem
            key={index}
            component={item.href ? Link : "button"}
            href={item.href}
            onClick={item.onClick}
            sx={{ color: "#1976d2" }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (!ready) {
    return <div>Loading translations...</div>; // Показываем загрузку, пока переводы не готовы
  }

  return (
    <>
      <AppBar
        position="static"
        sx={{ bgcolor: "#374151", borderBottom: "2px solid #1565c0" }}
      >
        <Toolbar
          sx={{
            flexWrap: "wrap",
            justifyContent: { xs: "space-between", sm: "space-between" },
            py: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {t("title")}
          </Typography>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: { xs: 1, sm: 2, md: 3 },
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {renderMenuByRole().map((item, index) => (
              <Button
                key={index}
                color="inherit"
                component={item.href ? Link : "button"}
                href={item.href}
                onClick={item.onClick}
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                  px: { xs: 1, sm: 2 },
                  minWidth: "auto",
                }}
              >
                {item.text}
              </Button>
            ))}
            <LanguageSwitcher />
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: "block", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ p: 2 }}>
          <h1>{t("title")}</h1>
          <p>{t("welcome")}</p>
          {drawerMenu}
          <LanguageSwitcher />
        </Box>
      </Drawer>
    </>
  );
};

export default TopMenu;