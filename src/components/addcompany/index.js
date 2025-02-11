import React, {useState} from 'react';
import {
    TextField,
    Container,
    Button,
    Typography,
    Grid,
    Paper,
    Stack
} from '@mui/material';
import {useDispatch} from 'react-redux';
import {addFullProfileDataAction} from '@/store/slices/authSlice';
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
import Header from '../header';
import Link from 'next/link';
import { addCompanyAction } from '@/store/slices/authSlice';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
export default function AddPCompany  () {
    const dispatch = useDispatch();
    
    const [isUR,setIsUR]=useState(true)
    const [contactPhone,setContactPhone] = useState('');
    const [name, setName] = useState('');
    const [bin, setBin] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [success, setSuccess] = useState(false);

    const [error, setError] = useState('');
  
    const [serverError, setServerError] = useState('');
    const errorFromSlice= useSelector((state) => state.auth.error);
    console.log('errorFromSlice',errorFromSlice.message)
   

    // const myFunction=()=>{
    //     setServerError(errorFromSlice.message)
    // }
    useEffect(()=>{
        setServerError(errorFromSlice.message)
        // setServerError('')
        
    },[errorFromSlice,isUR])


    const handleChange = (e) => {
        const {name, value} = e.target;
        switch (name) {
            case 'contactEmail':
                setContactEmail(value);
                break;
            case 'contactPhone':
                setContactPhone(value);
                break;
            case 'name':
                setName(value);
                break;
            case 'bin':
                setBin(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'address':
                setAddress(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async () => { // Проверка наличия всех обязательных полей перед отправкой

        if (!contactPhone || !name ) {
            setError('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        // Сброс ошибки и отправка данных
        setServerError('')
        console.log('serverErrpr after handleSubmit',serverError)
        setError('');
        await dispatch(addCompanyAction({name,description,bin,address,contactEmail,contactPhone,isUR}));
        setSuccess(true);
    };

  
    const handleChangeRadio = (e) => {
        setIsUR(e.target.value === 'true'); // Convert the string to boolean
      };

    return (
        
      
      <div className='flexColumn'>
         
               
                <Row>
                    <Col className="" sm="4" xs="6"></Col>
                    <Col sm="4" xs="6">
                   
                            <Row className="card">
                                <Col>
                                    <Label>
                                        Заполните данные компании
                                    </Label>
                                    <form action="" method='POST'>
                                    <fieldset>
                                        <legend>Выберите тип компании:</legend>
                                        <div>
                                            <input
                                            type="radio"
                                            id="UR"
                                            name="drone"
                                            value={true}
                                            checked={isUR}
                                            onChange={handleChangeRadio}
                                            />
                                            <label htmlFor="UR">Юридическое лицо</label>
                                        </div>

                                        <div>
                                            <input
                                            type="radio"
                                            id="IP"
                                            name="drone"
                                            value={false}
                                            checked={!isUR}
                                            onChange={handleChangeRadio}
                                            />
                                            <label htmlFor="IP">ИП</label>
                                        </div>
                                        </fieldset>

                                        {console.log('isUR=',isUR)}

                                        <Input label="Name of company" name="name" type="text"
                                            value={name}
                                            onChange={handleChange}
                                            placeholder='Введите название компании'/>

                                        <Input label="bin" name="bin"
                                            value={bin}
                                            onChange={handleChange}
                                            placeholder='Введите БИН'/>    
                                        
                                        <Input label="Описание" name="description"
                                            value={description}
                                            onChange={handleChange}
                                            placeholder='Введите описание компании'/>
                                        <Input label="adres" name="address"
                                            value={address}
                                            onChange={handleChange}
                                            placeholder='Введите Адрес компании'/>
                                       
                                        <Input label="contactPhone" name="contactPhone"
                                            value={contactPhone}
                                            onChange={handleChange}
                                            required={true}
                                            placeholder='Введите контактный телефон'/> 
                                         <Input label="contactEmail" name="contactEmail"
                                            value={contactEmail}
                                            required={true}
                                            onChange={handleChange}
                                            placeholder='Введите электронную почту'/>    
                                        

                                        {error && <Typography color="error">{error}</Typography>}
                                        {serverError && <p>{serverError}</p>}
                                        {serverError ==''  &&(
                                        <Typography color="primary">Данные успешно отправлены.</Typography>
                                        )}


                                        <br />
                                        <Button variant="contained" color="primary"
                                            onClick={handleSubmit}>
                                           Сохранить
                                        </Button>
                                    </form>


                                </Col>
                            </Row>
                   

                    </Col>
                    <Col className="" sm="4"></Col>
                </Row>
            </div>
           

          
          



    );
};

 

