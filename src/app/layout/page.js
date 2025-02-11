'use client' 

import { authorize } from '@/store/slices/authSlice'
import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getBannerByCompanyIdAction, getUserInfo,getAllBanners } from "@/store/slices/authSlice";


import { useRef } from "react"
import React from "react"
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// const API_KEY = "d11ae1cd-cdbf-4395-a8b0-19c5b6584b84";
// const API_KEY = "b83b032d-0418-41de-bbaa-b028ca3fdb9b"


export default function Layout() {

 

      
    return (<>

<h1>asdad</h1>
    </>
    )
}