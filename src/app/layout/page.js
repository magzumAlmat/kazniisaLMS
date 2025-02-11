"use client";

import { useTokenInitialization } from "@/store/slices/authSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBannerByCompanyIdAction,
  getUserInfo,
  getAllBanners,
} from "@/store/slices/authSlice";

import { useRef } from "react";
import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import jwtDecode from "jwt-decode";
// const API_KEY = "d11ae1cd-cdbf-4395-a8b0-19c5b6584b84";
// const API_KEY = "b83b032d-0418-41de-bbaa-b028ca3fdb9b"

export default function Layout() {
      
      const isAuth=useSelector((state)=>state.auth.isAuth)
     
      const userData=useSelector((state)=>state.auth.currentUser)
     
      const dispatch=useDispatch()

if(isAuth==true){
    console.log('isAuth=' ,isAuth)
    console.log('Вы залогинены',userData)
    // router.push('/layout');
  }
  const token = localStorage.getItem("token");

  console.log('2 userTokenINITZ token=', token);
 
  let decodedToken = jwtDecode(token);
   console.log('3 getUsersPosts decoded=', decodedToken.username);

  if (!token) {
    // Handle the case where the token is not available or invalid
    console.error("Token not available");
    return;
  }



  return (
    <>
      <h1>hi logged in User</h1>
    </>
  );
}
