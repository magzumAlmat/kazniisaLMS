import React, { useEffect, useState } from 'react';
import {
  TextField,
  Container,
  Button,
  Select,
  MenuItem,
  Modal,
  Typography,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel
  
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addFullProfileDataAction } from '@/store/slices/authSlice';
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
  FormGroup,
} from 'reactstrap';
import Header from '../header';
import Link from 'next/link';
import { useRef } from 'react';
import { addCompanyAction } from '@/store/slices/authSlice';
import { addBannerAction, getAllCompanies } from '@/store/slices/authSlice';

import { GisMap } from '../map';

import { useDropzone } from 'react-dropzone';
export default function AddBanner() {
  const allCompaniesFromReducer= useSelector((state) => state.auth.allCompanies);
  console.log('ALL COMPANIES', allCompaniesFromReducer);
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [bannerNumber, setBannerNumber] = useState('');
  const [bannerAddress, setBannerAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [name, setName] = useState('');
  const [bin, setBin] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [createdDate, setCreatedDate] = useState(''); // Added
  const [rentDays, setRentDays] = useState(''); // Added
  const [expiredDate, setExpiredDate] = useState(''); // Added
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState();
  
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null); // New state variable
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isContainProhibitedAD, setIsContainProhibitedAD] = useState(false);
  const [excludeFromReport, setExcludeFromReport]=useState(false)
  const [isAdRemoved, setIsAdRemoved]=useState(false)
  const [isOnListOfDismantling,setIsOnListOfDismantling]=useState(false)
  const [selectCategoryOfStreet,setCategoryOfStreet]=useState('')
  const categoriesOfStreets = [
    { id: 1, nameOfCategory: 'Категория A'},
    { id: 2, nameOfCategory: 'Категория B'},
    // Add more data as needed
  ];

 

  const typeOfAdObject = [
    {id: 1, nameOfType: 'Билборд/ситиборд (сторона А)'},
    {id: 2, nameOfType: 'Стихийная'},
    {id: 3, nameOfType: 'Указатели (трансп. опора) '},
    {id: 4, nameOfType: 'На заборе '},
    {id: 5, nameOfType: 'LED дисплей '},
    {id: 6, nameOfType: 'Мьюпи '},
    {id: 7, nameOfType: 'Фасад '},
    {id: 8, nameOfType: 'Бегущая строка '},
    {id: 9, nameOfType: 'Стелла '},
    {id: 10, nameOfType: 'Указатель (опора освещения) '},
    {id: 11, nameOfType: 'Палатка/Тент/Шатер/Навес/Уличная мебель/Остановка '},
    {id: 12, nameOfType: 'Другое '},
    {id: 13, nameOfType: 'Вывеска '},
    {id: 14, nameOfType: 'Надкрышная '},
    {id: 15, nameOfType: 'Выносная/передвижная реклама '},
    {id: 16, nameOfType: 'Брендмауэр'},
    {id: 17, nameOfType: 'Билборд/ситиборд (сторона B)'},
  ]


  const [selectedType, setSelectedType] = useState('');

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const viewOfAd = [
    {id: 1, nameOfView: 'Наружняя визуальная реклама за исключением видеоизображения'},
    {id: 2, nameOfView: 'Лайтбокс (сити-формат)'},
    {id: 3, nameOfView: 'Надкрышная световая наружная (визуальная) реклама (светодиномические панно или объемные неоновые буквы)'},
    {id: 4, nameOfView: 'Реклама на палатках, тентах, шатрах, навесах, зонтах, флагах, вымпелах, штандартах'},
    {id: 5, nameOfView: 'Реклама на киосках и павильонах временного типа'},
    {id: 6, nameOfView: 'Выносная передвижная реклама'},
    {id: 7, nameOfView: 'LED экран'},
    {id: 8, nameOfView: 'Бегущая строка'},
    {id: 9, nameOfView: 'Уличная мебель'},
    {id: 10,nameOfView: 'Ситиборд'},
  ]

  const [selectedViewOfAd, setSelectedViewOfAd] = useState('');


  const handleTypeChangeSelectedViewOfAd = (event) => {
    setSelectedViewOfAd(event.target.value);
  };


  const tariffsByViewOfAd1= [ 
    {id: 1, tariffName: 'До 2-х кв. м.'},
    {id: 2, tariffName: 'от 2 до 5 кв. м'},
    {id: 3, tariffName: 'от 5 до 10 кв.м'},
    {id: 4, tariffName: 'от 10 до 20 кв.м'},
    {id: 5, tariffName: 'от 20 до 30 кв.м'},
    {id: 6, tariffName: 'от 30 до 50 кв.м'},
    {id: 7, tariffName: 'от 50 до 70 кв.м'},
    {id: 8, tariffName: 'свыше 70 кв.м'},
  ]
  const [selectedTariffsByViewOfAd1, setSelectedTariffsByViewOfAd1] = useState('');

  const handleTypeChangeSelectedTariffByViewOfAd = (event) => {
    setSelectedTariffsByViewOfAd1(event.target.value);
  };

  const tariffsByViewOfAd2= [ 
    {id: 1, tariffName: 'Все размеры'},
    
  ]
  const [selectedTariffsByViewOfAd2, setSelectedTariffsByViewOfAd2] = useState('');

  const handleTypeChangeSelectedTariffByViewOfAd2 = (event) => {
    setSelectedTariffsByViewOfAd2(event.target.value);
  };

  const tariffsByViewOfAd3= [ 
    {id: 1, tariffName: 'до 30 кв.м'},
    {id: 2, tariffName: 'свыше 30 кв.м'},
    
  ]
  const [selectedTariffsByViewOfAd3, setSelectedTariffsByViewOfAd3] = useState('');

  const handleTypeChangeSelectedTariffByViewOfAd3 = (event) => {
    setSelectedTariffsByViewOfAd3(event.target.value);
  };

  const tariffsByViewOfAd4= [ 
    {id: 1, tariffName: 'до 5 кв.м'},
    {id: 2, tariffName: 'от 5 до 10 кв.м'},
    {id: 3, tariffName: 'свыше 10 кв.м'},
    
  ]
  const [selectedTariffsByViewOfAd4, setSelectedTariffsByViewOfAd4] = useState('');

  const handleTypeChangeSelectedTariffByViewOfAd4 = (event) => {
    setSelectedTariffsByViewOfAd4(event.target.value);
  };


  const tariffsByViewOfAd5= [ 
    {id: 1, tariffName: 'до 2 кв.м'},
    {id: 2, tariffName: 'от 2 до 5 кв.м'},
    {id: 3, tariffName: 'от 5 до 10 кв.м'},
    {id: 4, tariffName: 'свыше 10 кв.м'},
    
    
  ]
  const [selectedTariffsByViewOfAd5, setSelectedTariffsByViewOfAd5] = useState('');

  const handleTypeChangeSelectedTariffByViewOfAd5 = (event) => {
    setSelectedTariffsByViewOfAd5(event.target.value);
  };


  const tariffsByViewOfAd6= [ 
    {id: 1, tariffName: 'Все размеры'},
    
  ]
  const [selectedTariffsByViewOfAd6, setSelectedTariffsByViewOfAd6] = useState('');

  const handleTypeChangeSelectedTariffByViewOfAd6 = (event) => {
    setSelectedTariffsByViewOfAd6(event.target.value);
  };


  const tariffsByViewOfAd7= [ 
    {id: 1, tariffName: 'до 20 кв.м'},
    {id: 2, tariffName: 'свыше 20 кв.м'},
    
  ]
  const [selectedTariffsByViewOfAd7, setSelectedTariffsByViewOfAd7] = useState('');

  const handleTypeChangeSelectedTariffByViewOfAd7 = (event) => {
    setSelectedTariffsByViewOfAd7(event.target.value);
  };



  const tariffsByViewOfAd8= [ 
    {id: 1, tariffName: 'Все размеры'},
    
  ]
  const [selectedTariffsByViewOfAd8, setSelectedTariffsByViewOfAd8] = useState('');

  const handleTypeChangeSelectedTariffByViewOfAd8 = (event) => {
    setSelectedTariffsByViewOfAd8(event.target.value);
  };

 
  const tariffsByViewOfAd9= [ 
    {id: 1, tariffName: 'Все размеры'},
    
  ]
  const [selectedTariffsByViewOfAd9, setSelectedTariffsByViewOfAd9] = useState('');

  const handleTypeChangeSelectedTariffByViewOfAd9 = (event) => {
    setSelectedTariffsByViewOfAd9(event.target.value);
  };


  const tariffsByViewOfAd10= [ 
    {id: 1, tariffName: 'от 5 до 10 кв.м'},
    
  ]
  const [selectedTariffsByViewOfAd10, setSelectedTariffsByViewOfAd10] = useState('');

  const handleTypeChangeSelectedTariffByViewOfAd10 = (event) => {
    setSelectedTariffsByViewOfAd10(event.target.value);
  };

const [countOfSides,setCountOfSides]=useState('')

  useEffect(() => {
    dispatch(getAllCompanies());
    console.log('all companies =====', allCompaniesFromReducer);
  },[allCompaniesFromReducer,dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'title':
        setTitle(value);
        break;
      case 'selectedFile':
        setSelectedFile(value);
        break;
      case 'bannerNumber':
        setBannerNumber(value);
        break;
      case 'bannerAddress':
        setBannerAddress(value);
        break;
      case 'createdDate': // Added
        setCreatedDate(value);
        break;
      case 'rentDays': // Added
        setRentDays(value);
        break;
      case 'expiredDate': // Added
          setExpiredDate(value);
          break;
      case 'countOfSides': // Added
          setCountOfSides(value);
          break;
  
      case 'description': // Added
          setDescription(value);
          break;

      default:
        break;
    }
  };

  const [markerPosition, setMarkerPosition] = useState(null);

  const handleMarkerPositionChange = (newMarkerPosition) => {
    setMarkerPosition(newMarkerPosition);
  }

  const handleSubmit = async () => {
    // Проверка наличия всех обязательных полей перед отправкой
    if ( !bannerAddress ) {
      setError('Пожалуйста, заполните все обязательные поля.');
      return;
    }

    // Сброс ошибки и отправка данных
    setError('');

    
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('imageUrl', file);
    });
    // formData.append('imageUrl', selectedFiles);
    formData.append('title', title);
    formData.append('bannerNumber', bannerNumber);
    formData.append('bannerAddress', bannerAddress);
    formData.append('createdDate', createdDate); // Added
    formData.append('expiredDate', expiredDate); // Added
    formData.append('bannerLongitude', markerPosition.lng); // Added
    formData.append('bannerLatitude', markerPosition.lat); // Added
    formData.append('companyId', selectedCompanyId); // Added
    formData.append('selectedType', selectedType);  //тип рекламы
    formData.append('selectedViewOfAd',selectedViewOfAd)
    if (selectedViewOfAd=='Наружняя визуальная реклама за исключением видеоизображения'){formData.append('tariff',selectedTariffsByViewOfAd1)}
     if(selectedViewOfAd=='Лайтбокс (сити-формат)'){formData.append('tariff',selectedTariffsByViewOfAd2)}
     if(selectedViewOfAd=='Надкрышная световая наружная (визуальная) реклама (светодиномические панно или объемные неоновые буквы)'){formData.append('tariff',selectedTariffsByViewOfAd3)}
     if(selectedViewOfAd=='Реклама на палатках, тентах, шатрах, навесах, зонтах, флагах, вымпелах, штандартах'){formData.append('tariff',selectedTariffsByViewOfAd4)}
     if(selectedViewOfAd=='Реклама на киосках и павильонах временного типа'){formData.append('tariff',selectedTariffsByViewOfAd5)}
     if(selectedViewOfAd=='Выносная передвижная реклама'){formData.append('tariff',selectedTariffsByViewOfAd6)}
     if(selectedViewOfAd=='LED экран'){formData.append('tariff',selectedTariffsByViewOfAd7)}
     if(selectedViewOfAd=='Бегущая строка'){formData.append('tariff',selectedTariffsByViewOfAd8)}
     if(selectedViewOfAd=='Уличная мебель'){formData.append('tariff',selectedTariffsByViewOfAd9)}
     if(selectedViewOfAd=='Ситиборд'){formData.append('tariff',selectedTariffsByViewOfAd10)}

     formData.append('countOfSides',countOfSides);
     formData.append('categoryOfStreet',selectCategoryOfStreet);
     formData.append('isContainProhibitedAD', isContainProhibitedAD);

    formData.append('excludeFromReport',excludeFromReport)
    formData.append('isAdRemoved,',isAdRemoved)
    formData.append('isOnListOfDismantling',isOnListOfDismantling)




    await dispatch(addBannerAction(formData));
    setSuccess(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleClick = () => {
    inputRef.current.click();
    console.log('handle click start', selectedFile);
  };

  const handleCompanySelect = (companyId) => {
    setSelectedCompanyId(companyId);
    setModalOpen(false);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const SearchableTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };
    
    const selectedCompany = (id) => {
        console.log('This is selected company Id = ', id);
        filteredData.map(item => {
          if (item.id == id) {
            setSelectedCompanyName(item.name)
          }
        })
        setSelectedCompanyId(id)
        handleModalClose();
    }
  
    const filteredData = allCompaniesFromReducer.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bin.toLowerCase().includes(searchTerm.toLowerCase())
    );
      return (
        <div>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell>Действие</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Bin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell><Button onClick={()=>selectedCompany(row.id)}>выбрать</Button></TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.bin}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      );
    };

    const handleChangeCategoryOfStreet = (e) => {
      setCategoryOfStreet(e.target.value ); // Convert the string to boolean
    };
  

    const handleChangeRadio = (e) => {
      setIsContainProhibitedAD(e.target.value === 'true'); // Convert the string to boolean
    };
    const handleChangeRadioExcludeFromReport = (e) => {
      setIsContainProhibitedAD(e.target.value === 'true'); // Convert the string to boolean
    };
    const handleChangeRadioIsRemoved = (e) => {
      setIsAdRemoved(e.target.value === 'true'); // Convert the string to boolean
    };

    const handleChangeRadioIsOnListOfDismantling = (e) => {
      setIsOnListOfDismantling(e.target.value === 'true'); // Convert the string to boolean
    };


    const [selectedFiles, setSelectedFiles] = useState([]);
   

    const handleClickImagePicker = () => {
      inputRef.current.click();
    };

    const handleFileChange1 = (acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({
      accept: 'image/*', // specify the file types you want to accept
      multiple: true,
      maxFiles: 10,
      onDrop: handleFileChange1,
    });

  return (
    <div className='flexColumn'>
    <Row>
        <Col className='' sm='12' xs='12'>
          <GisMap onMarkerPositionChange={handleMarkerPositionChange}/>
          </Col>
        {console.log('PARENT COMPONENT markerPOSITION=',markerPosition)}
    </Row>
     

      <Row>
        <Col className='' sm='4' xs='6'></Col>
        <Col sm='4' xs='6'>
       
          <Row className='card'>
            <Col>
              <Label>Заполните данные баннера</Label>

              {/* <form action='' method='POST'>
                <div>
                  <input
                    ref={inputRef}
                    onChange={handleFileChange}
                    type='file'
                    id='file'
                    style={{ display: 'none' }}
                  />
                  <button className='button button-primary' onClick={handleClick}>
                    Выберите фото
                  </button>
                  {selectedFile && (
                    <>
                      <p>Выбранный файл: {selectedFile.name}</p>
                      <img src={URL.createObjectURL(selectedFile)} alt='' width={400} height={300} />
                    </>
                  )}
                </div> */}
                <form action='' method='POST'>
                    <div {...getRootProps()} style={{ cursor: 'pointer', padding: '20px', border: '2px dashed #ddd' }}>
                      <input {...getInputProps()} ref={inputRef} style={{ display: 'none' }} />
                      <p>Перетащите сюда файлы или нажмите, чтобы выбрать файлы</p>
                    </div>

                    {selectedFiles.length > 0 && (
                      <>
                        <p>Выбранные файлы:</p>
                        <ul>
                          {selectedFiles.map((file) => (
                            <li key={file.name}>{file.name}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {selectedFiles.length > 0 &&
                      selectedFiles.map((file) => (
                        <div key={file.name}>
                          <img src={URL.createObjectURL(file)} alt='' width={400} height={300} />
                        </div>
                    ))}
                   
                <br />
                {/* <label >Наименование баннера</label>
                <Input
                  label='Name of company'
                  name='title'
                  type='text'
                  value={title}
                  onChange={handleChange}
                  placeholder='Введите название'
                /> */}

<label>{selectedCompanyName ? (<>{selectedCompanyName}</>):(<>Выберите компанию</>)}</label>
                
                <Button variant='outlined' color='primary' onClick={handleModalOpen}>
                  Выбрать компанию
                </Button>

                <Modal open={modalOpen} onClose={handleModalClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: '100vh', height: '100%' }}>
                    <Paper style={{ width: '100%', height: '100%', padding: '20px', textAlign: 'center' }}>
                      <SearchableTable/>
                    </Paper>
                    <Button onClick={handleModalClose} color='secondary' style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      Закрыть
                    </Button>
                  </div>
                </Modal>
                

                <br /><br />
                <FormControl>
                  <InputLabel id="typeOfAdObject-label">Select CategoryOfStreet</InputLabel>
                  <Select
                    labelId="typeOfAdObject-label"
                    id="typeOfAdObject"
                    value={selectCategoryOfStreet}
                    label="Select Type"
                    onChange={handleChangeCategoryOfStreet}
                  >
                    {categoriesOfStreets.map((item) => (
                      <MenuItem key={item.id} value={item.nameOfCategory}>
                        {item.nameOfCategory}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selectCategoryOfStreet}









<br /><br />
                <FormControl>
                  <InputLabel id="typeOfAdObject-label">Select Type</InputLabel>
                  <Select
                    labelId="typeOfAdObject-label"
                    id="typeOfAdObject"
                    value={selectedType}
                    label="Select Type"
                    onChange={handleTypeChange}
                  >
                    {typeOfAdObject.map((item) => (
                      <MenuItem key={item.id} value={item.nameOfType}>
                        {item.nameOfType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selectedType}
                <br /><br />
              
                <FormControl>
                  {/* <InputLabel id="typeOfView-label">Select viewOfAd</InputLabel> */}
                  <Select
                    labelId="typeOfView-label"
                    id="typeOfView"
                    value={selectedViewOfAd}
                    label="Select View"
                    onChange={handleTypeChangeSelectedViewOfAd}
                  >
                    {viewOfAd.map((item) => (
                      <MenuItem key={item.id} value={item.nameOfView}>
                        {item.nameOfView}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                
                <br /><br />

              {console.log('Выбранный вид рекламы =',selectedViewOfAd)}
              <label>{selectedViewOfAd=='Наружняя визуальная реклама за исключением видеоизображения' ? (<>
               <FormControl style={{'width':'400px'}}>
                  {/* <InputLabel id="tariffslabel">Select tariff for Наружняя визуальная реклама за исключением видеоизображения </InputLabel> */}
                  <Select
                    labelId="tariffs-label"
                    id="tariffs"
                    value={selectedTariffsByViewOfAd1}
                    label="Select Tariffs"
                    onChange={handleTypeChangeSelectedTariffByViewOfAd}
                  >
                    {tariffsByViewOfAd1.map((item) => (
                      <MenuItem key={item.id} value={item.tariffName}>
                        {item.tariffName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl></>):(<> Выберите вид рекламы</>)}</label>

                <label>{selectedViewOfAd=='Лайтбокс (сити-формат)' ? (<>
               <FormControl style={{'width':'400px'}}>
                  {/* <InputLabel id="tariffslabel">Select tariff for Наружняя визуальная реклама за исключением видеоизображения </InputLabel> */}
                  <Select
                    labelId="tariffs-label"
                    id="tariffs"
                    value={selectedTariffsByViewOfAd2}
                    label="Select Tariffs"
                    onChange={handleTypeChangeSelectedTariffByViewOfAd2}
                  >
                    {tariffsByViewOfAd2.map((item) => (
                      <MenuItem key={item.id} value={item.tariffName}>
                        {item.tariffName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl></>):(<> </>)}</label>
               

                <label>{selectedViewOfAd=='Надкрышная световая наружная (визуальная) реклама (светодиномические панно или объемные неоновые буквы)' ? (<>
               <FormControl style={{'width':'400px'}}>
                  {/* <InputLabel id="tariffslabel">Select tariff for Наружняя визуальная реклама за исключением видеоизображения </InputLabel> */}
                  <Select
                    labelId="tariffs-label"
                    id="tariffs"
                    value={selectedTariffsByViewOfAd3}
                    label="Select Tariffs"
                    onChange={handleTypeChangeSelectedTariffByViewOfAd3}
                  >
                    {tariffsByViewOfAd3.map((item) => (
                      <MenuItem key={item.id} value={item.tariffName}>
                        {item.tariffName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl></>):(<> </>)}</label>


                <label>{selectedViewOfAd=='Реклама на палатках, тентах, шатрах, навесах, зонтах, флагах, вымпелах, штандартах' ? (<>
               <FormControl style={{'width':'400px'}}>
                  {/* <InputLabel id="tariffslabel">Select tariff for Наружняя визуальная реклама за исключением видеоизображения </InputLabel> */}
                  <Select
                    labelId="tariffs-label"
                    id="tariffs"
                    value={selectedTariffsByViewOfAd4}
                    label="Select Tariffs"
                    onChange={handleTypeChangeSelectedTariffByViewOfAd4}
                  >
                    {tariffsByViewOfAd4.map((item) => (
                      <MenuItem key={item.id} value={item.tariffName}>
                        {item.tariffName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl></>):(<> </>)}</label>
               

                <label>{selectedViewOfAd=='Реклама на киосках и павильонах временного типа' ? (<>
               <FormControl style={{'width':'400px'}}>
                  {/* <InputLabel id="tariffslabel">Select tariff for Наружняя визуальная реклама за исключением видеоизображения </InputLabel> */}
                  <Select
                    labelId="tariffs-label"
                    id="tariffs"
                    value={selectedTariffsByViewOfAd5}
                    label="Select Tariffs"
                    onChange={handleTypeChangeSelectedTariffByViewOfAd5}
                  >
                    {tariffsByViewOfAd5.map((item) => (
                      <MenuItem key={item.id} value={item.tariffName}>
                        {item.tariffName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl></>):(<> </>)}</label>
               

                <label>{selectedViewOfAd=='Выносная передвижная реклама' ? (<>
               <FormControl style={{'width':'400px'}}>
                  {/* <InputLabel id="tariffslabel">Select tariff for Наружняя визуальная реклама за исключением видеоизображения </InputLabel> */}
                  <Select
                    labelId="tariffs-label"
                    id="tariffs"
                    value={selectedTariffsByViewOfAd6}
                    label="Select Tariffs"
                    onChange={handleTypeChangeSelectedTariffByViewOfAd6}
                  >
                    {tariffsByViewOfAd6.map((item) => (
                      <MenuItem key={item.id} value={item.tariffName}>
                        {item.tariffName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl></>):(<> </>)}</label>
               
                <label>{selectedViewOfAd=='LED экран' ? (<>
               <FormControl style={{'width':'400px'}}>
                  {/* <InputLabel id="tariffslabel">Select tariff for Наружняя визуальная реклама за исключением видеоизображения </InputLabel> */}
                  <Select
                    labelId="tariffs-label"
                    id="tariffs"
                    value={selectedTariffsByViewOfAd7}
                    label="Select Tariffs"
                    onChange={handleTypeChangeSelectedTariffByViewOfAd7}
                  >
                    {tariffsByViewOfAd7.map((item) => (
                      <MenuItem key={item.id} value={item.tariffName}>
                        {item.tariffName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl></>):(<> </>)}</label>
           
               
                <label>{selectedViewOfAd=='Бегущая строка' ? (<>
               <FormControl style={{'width':'400px'}}>
                  {/* <InputLabel id="tariffslabel">Select tariff for Наружняя визуальная реклама за исключением видеоизображения </InputLabel> */}
                  <Select
                    labelId="tariffs-label"
                    id="tariffs"
                    value={selectedTariffsByViewOfAd8}
                    label="Select Tariffs"
                    onChange={handleTypeChangeSelectedTariffByViewOfAd8}
                  >
                    {tariffsByViewOfAd8.map((item) => (
                      <MenuItem key={item.id} value={item.tariffName}>
                        {item.tariffName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl></>):(<> </>)}</label>



                <label>{selectedViewOfAd=='Уличная мебель' ? (<>
               <FormControl style={{'width':'400px'}}>
                  {/* <InputLabel id="tariffslabel">Select tariff for Наружняя визуальная реклама за исключением видеоизображения </InputLabel> */}
                  <Select
                    labelId="tariffs-label"
                    id="tariffs"
                    value={selectedTariffsByViewOfAd9}
                    label="Select Tariffs"
                    onChange={handleTypeChangeSelectedTariffByViewOfAd9}
                  >
                    {tariffsByViewOfAd9.map((item) => (
                      <MenuItem key={item.id} value={item.tariffName}>
                        {item.tariffName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl></>):(<> </>)}</label>



             
                <label>{selectedViewOfAd=='Ситиборд' ? (<>
               <FormControl style={{'width':'400px'}}>
                  {/* <InputLabel id="tariffslabel">Select tariff for Наружняя визуальная реклама за исключением видеоизображения </InputLabel> */}
                  <Select
                    labelId="tariffs-label"
                    id="tariffs"
                    value={selectedTariffsByViewOfAd10}
                    label="Select Tariffs"
                    onChange={handleTypeChangeSelectedTariffByViewOfAd10}
                  >
                    {tariffsByViewOfAd10.map((item) => (
                      <MenuItem key={item.id} value={item.tariffName}>
                        {item.tariffName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl></>):(<> </>)}</label>


              
                <fieldset>
                                        <legend>Содержит запрещенную рекламу:</legend>
                                        <div>
                                            <input
                                            type="radio"
                                            id="UR"
                                            name="drone"
                                            value={true}
                                            checked={isContainProhibitedAD}
                                            onChange={handleChangeRadio}
                                            />
                                            <label htmlFor="">Да</label>
                                        </div>

                                        <div>
                                            <input
                                            type="radio"
                                            id="IP"
                                            name="drone"
                                            value={false}
                                            checked={!isContainProhibitedAD}
                                            onChange={handleChangeRadio}
                                            />
                                            <label htmlFor="IP">Нет</label>
                                        </div>
                </fieldset>

                      {console.log('Содержит запрещенную рекламу',isContainProhibitedAD)}


                      <fieldset>
                      <legend>Исключить из отчета:</legend>
                      <div>
                        <input
                          type="radio"
                          id="excludeYes"
                          name="excludeFromReport"
                          value={true}
                          checked={excludeFromReport}
                          onChange={handleChangeRadioExcludeFromReport}
                        />
                        <label htmlFor="excludeYes">Да</label>
                      </div>

                      <div>
                        <input
                          type="radio"
                          id="excludeNo"
                          name="excludeFromReport"
                          value={false}
                          checked={!excludeFromReport}
                          onChange={handleChangeRadioExcludeFromReport}
                        />
                        <label htmlFor="excludeNo">Нет</label>
                      </div>
                    </fieldset>



                    <fieldset>
                    <legend>Реклама удалена:</legend>
                    <div>
                      <input
                        type="radio"
                        id="removedYes"
                        name="isAdRemoved"
                        value={true}
                        checked={isAdRemoved}
                        onChange={handleChangeRadioIsRemoved}
                      />
                      <label htmlFor="removedYes">Да</label>
                    </div>

                    <div>
                      <input
                        type="radio"
                        id="removedNo"
                        name="isAdRemoved"
                        value={false}
                        checked={!isAdRemoved}
                        onChange={handleChangeRadioIsRemoved}
                      />
                      <label htmlFor="removedNo">Нет</label>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>На списке для демонтажа:</legend>
                    <div>
                      <input
                        type="radio"
                        id="dismantlingYes"
                        name="isOnListOfDismantling"
                        value={true}
                        checked={isOnListOfDismantling}
                        onChange={handleChangeRadioIsOnListOfDismantling}
                      />
                      <label htmlFor="dismantlingYes">Да</label>
                    </div>

                    <div>
                      <input
                        type="radio"
                        id="dismantlingNo"
                        name="isOnListOfDismantling"
                        value={false}
                        checked={!isOnListOfDismantling}
                        onChange={handleChangeRadioIsOnListOfDismantling}
                      />
                      <label htmlFor="dismantlingNo">Нет</label>
                    </div>
                  </fieldset>


                      {/* Исключить из отчета  Exclude from report
                      Реклама убрана  Advertising removed
                      В списке на демонтаж  On the list for dismantling
 */}

                <label >Кол-во объектов/сторон</label>
                <Input
                  label='номер бwаннера'
                  name='countOfSides'
                  value={countOfSides}
                  onChange={handleChange}
                  placeholder='Количество объектов/сторон'
                />

                  <h1>Сделать выбор уведомления</h1>
                <label >Описание рекламного объекта</label>
                <Input
                  label='description'
                  name='description'
                  value={description}
                  onChange={handleChange}
                  placeholder='Введите описание баннера'
                />

                <label >Номер баннера</label>
                <Input
                  label='номер баннера'
                  name='bannerNumber'
                  value={bannerNumber}
                  onChange={handleChange}
                  placeholder='номер банера'
                />
                <label >Адрес баннера</label>
                <Input
                  label='adress'
                  name='bannerAddress'
                  value={bannerAddress}
                  onChange={handleChange}
                  placeholder='Введите адрес баннера'
                />


                <label >Дата начала</label>
                <Input
                     type="date"
                  label='Created Date' // Added
                  name='createdDate'
                  value={createdDate}
                  onChange={handleChange}
                  placeholder='Введите дату создания'
                />
              
                <label >Дата окончания</label>
                <Input
                  type="date"
                  label='Expired Date' // Added
                  name='expiredDate'
                  value={expiredDate}
                  onChange={handleChange}
                  placeholder='Введите дату истечения'
                />
                {error && <Typography color='error'>{error}</Typography>}
                {success && <Typography color='primary'>Данные успешно отправлены.</Typography>}
                <br />
                <Button variant='contained' color='primary' onClick={handleSubmit}>
                  Сохранить
                </Button>
              </form>
            </Col>
          </Row>
        </Col>
        <Col className='' sm='4'></Col>
      </Row>
    </div>
  );
}
