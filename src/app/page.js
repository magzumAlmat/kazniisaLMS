import Image from 'next/image'
import styles from './page.module.css'
import * as React from 'react';
import Button from '@mui/material/Button';
import Login from './login/page';
import Layout from './layout/page';
export default function Home() {
  return (
   <main>
  <Login/>

   {/* <Button variant="contained">Hello world</Button> */}
   </main>
  )
}
