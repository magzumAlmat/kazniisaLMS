
'use client' 
import UserLogin from "@/components/login"
import Header from "@/components/header"
import AddProfileData from "@/components/addprofiledata"
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,

    Form,
    Row,
    Col,
    Label,
    Input,
    FormGroup

} from 'reactstrap';
import Link from "next/link";
export default function AddProfileDataPage() {
    return (
        <>
         {/* <div>
                <Nav>
                    <NavItem>
                        <NavLink>
                            Главная
                        </NavLink>
                    </NavItem>
                    <NavItem>

                        <NavLink>
                            <Link href="/addprofiledatapage">Заполнить профиль</Link>

                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink>
                            <Link href="/createbanner">Создать баннер</Link>

                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink>
                            <Link href="/customerprofile">Профиль</Link>
                        </NavLink>
                    </NavItem>

                </Nav>
            </div> */}

<Header loggedIn={true}/>
<br />
            <AddProfileData/>
            
     
        
        </>
    )
}
