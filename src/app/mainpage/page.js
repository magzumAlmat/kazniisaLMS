'use client'



import UserLogin from "@/components/login"
import Header from "@/components/header"
import Link from "next/link"
import ImageUpload from "@/components/imagesupload"





export default function MainPage() {
   

  return (
    <>
    <main>  
        <Header loggedIn={true}/>
        <br />
        <h1>Welcome</h1>
        <h1>
                    Заполните компанию
                    <Link href="/addcompany">
                    <button className="btn btn-primary">
                        заполнить компанию
                    </button>
                    </Link>

                </h1>
                
                <h1>
                    Создайте баннер
                <Link href="/addbanner">
                <button className="btn btn-primary">
                    создать баннер
                </button>
                </Link>
                </h1>

<ImageUpload/>
<br />
<br />
<br />




    </main>

   {/* <YandexMap/> */}
    
    </>

  )
}
