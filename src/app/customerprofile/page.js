
'use client'
import UserLogin from "@/components/login"
import Header from "@/components/header"
import Profile from "@/components/profile"
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

export default function AddCompanyPage() {
    
    return (
        <>
            <Header loggedIn={true}/>
            <br />
            <Profile/>



        </>
    )
}
