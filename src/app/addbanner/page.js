
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
import AddCompany from "@/components/addcompany";
import AddBanner from "@/components/addbanner";
export default function AddBannerPage() {
    return (
        <>
           <Header loggedIn={true}/>
            <br />
            <AddBanner/>
            
     
        
        </>
    )
}
