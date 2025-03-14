"use client"; 
import './globals.css'
import ReduxProvider from '../store/provider'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// export const metadata = {
//   title: 'Second Lesson',
//   description: 'Learn nextJS and React',
// }
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { loginReducer } from "@/store/slices/authSlice";
// import useTokenFromURL from '@/components/useTokenFromURL';
// import useTokenInitialization from '../store/slices/authSlice';
// import { NextIntlClientProvider } from 'next-intl';
// import { useRouter } from 'next/navigation';

export default function RootLayout({ children}) {
  // const router = useRouter();
 // useTokenInitialization()
 
  

  return (
    <html lang="en">
      <ReduxProvider>
        <body>{children}</body>
        {/* <NextIntlClientProvider locale={locale} messages={require(`../../i18n/${locale}.json`)}> */}

       {/* </NextIntlClientProvider> */}
      </ReduxProvider>
    </html>
  )
}


