import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {Button, TextField} from '@mui/material';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useDispatch, useSelector} from 'react-redux';
import {loginInspectorAction, sendMail} from '@/store/slices/authSlice';
import {sendCodeToEmailAction, verifyCodeAction} from '@/store/slices/authSlice';
import {
    Form,
    Row,
    Col,
    Label,
    Input,
    FormGroup
} from 'reactstrap';
import { loginAction } from '@/store/slices/authSlice';
export default function Login() {
    const dispatch = useDispatch()
    const [isWaiting, setIsWaiting] = useState(false);
    const router = useRouter();
    const initialTime = 30; // Начальное время в секундах
    const [time, setTime] = useState(initialTime);
    const [isInputEnabled, setInputEnabled] = useState(true);
    const [isWrongCode, setIsWrongCode] = useState(false);
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const someVar = useSelector((state) => state.auth.someVar);
    const token = useSelector((state) => state.auth.authToken);
    // const currentUser=useSelector((state)=>{state.auth.currentUser})
    // console.log('somevar',someVar,'authToken=',token)

    
    useEffect(() => {
        
        const timer = setInterval(() => {
            if (time > 0) {
                setTime(time - 1);
            } else {
                clearInterval(timer);
                setIsWrongCode(false); // Сбросить состояние неверного кода после окончания отсчета
                setInputEnabled(true); // Разрешить ввод после окончания отсчета
            }
        }, 1000);

        // Очистите таймер при размонтировании компонента
        return() => {
            clearInterval(timer);
        };
    }, [time]);

    // Форматирование времени в минуты и секунды
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const handleInputChange = (event) => {
        setCode(event.target.value);

        if (!isWaiting && isWrongCode) {
            setInputEnabled(true); // Разрешить ввод после ожидания 10 секунд
            setIsWrongCode(false);
        }
    };

    const handleCodeSubmit = () => {

        const lastFour = someVar.slice(-4);
        console.log('code=', code, 'somevar', lastFour)


        if (code == lastFour) {
            setInputEnabled(true); // Разрешить ввод
            dispatch(verifyCodeAction(email, lastFour))
           
            router.push('/mainpage');
           
           

        } else {
            setIsWrongCode(true);
            setInputEnabled(false);
            setTime(30); // Блокировать на 3 минуты
        }
    };


    const validateEmail = (email) => { // Простая проверка формата email с использованием регулярного выражения
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return emailPattern.test(email);
    };


    const loginWithEmailAndPassword=async()=>{
        await dispatch(loginAction(email,password))   
        // window.location.reload();     
        router.push('/mainpage');
       
    }

    const loginInspectorWithEmailAndPassword=async()=>{
        await dispatch(loginInspectorAction(email,password))    
        // window.location.reload();    
        router.push('/inspector');
       
    }

    const handleClickEnterWithLoginPassword=async()=>{
        setStep(3);
        // if (validateEmail(email)) {
        //     setStep(3);
            

          

        // } else {
        //     alert('Пожалуйста, введите действительный адрес электронной почты.');
        // }
       
    }

    const handleInspectorEnterWithEmailAndPassword=async()=>{
        // if (validateEmail(email)) {
            setStep(4);
            

          

        // } else {
        //     alert('Пожалуйста, введите действительный адрес электронной почты.');
        // }
       
    }

    const handleClick = async () => {

        if (validateEmail(email)) {
            setStep(2);
            await dispatch(sendCodeToEmailAction(email))

        } else {
            alert('Пожалуйста, введите действительный адрес электронной почты.');
        }


    }

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };
    return (
        <>

{  step === 1 &&
            <Row>
                <Col className="" sm="4" xs="6"></Col>
                <Col sm="4" xs="6">
                    <Form>
                        <Row className="card">
                            <Col>
                                <Label>
                                    Введите свой Email
                                </Label>
                                <Input id="outlined-basic" variant="outlined" 
                                    value={email}
                                    onChange={handleChangeEmail}
                                    type="email"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                    // Паттерн для валидации
                                    title="Введите действительный адрес электронной почты"
                                />
                                <br/>
                                <Button onClick={handleClick} color="primary">Продолжить

                                </Button>

                                <Button onClick={handleClickEnterWithLoginPassword} color="primary">Вход

                                </Button>
                                <Button onClick={handleInspectorEnterWithEmailAndPassword} color="primary">Вход Инспектор

                                </Button>
                            </Col>
                        </Row>
                    </Form>

                </Col>
                <Col className="" sm="4"></Col>
            </Row>
}


{  step === 2 &&
            <Row>
                <Col className="" sm="4" xs="6"></Col>
                <Col sm="4" xs="6">
                    <Form>
                        <Row className="card">
                            <Col>
                            
                                <Label className="visually-hidden" for="exampleEmail">
                                  Отправили код на {email}
                                </Label>
                                <Label>
                                    Введите код чтобы подтвердить что это вы, а не кто-то другой
                                </Label>
                                <Input id="outlined-basic" variant="outlined" 
                                     disabled={
                                      !isInputEnabled
                                  }
                                  value={code}
                                  onChange={handleInputChange}
                                />
                                <br/>
                                {
                                        isWrongCode && <p>Неверный код. Попробуйте {minutes}:{
                                            seconds < 10 ? `0${seconds}` : seconds
                                        }</p>
                                    }
                                        <br/>
                                <Button  disabled={!isInputEnabled} onClick={handleCodeSubmit} color="primary">
                                      Продолжить
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                </Col>
                <Col className="" sm="4"></Col>
            </Row>
}


{  step === 3 &&
            <Row>
                <Col className="" sm="4" xs="6"></Col>
                <Col sm="4" xs="6">
                    <Form>
                        <Row className="card">
                            <Col>
                                <Label>
                                    Введите email и пароль
                                </Label>
                                <Input id="outlined-basic" variant="outlined" 
                                    value={email}
                                    onChange={handleChangeEmail}
                                    type="email"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                    // Паттерн для валидации
                                    title="Введите действительный адрес электронной почты"
                                />
                                 <Input id="outlined-basic" variant="outlined" 
                                    value={password}
                                    onChange={handleChangePassword}
                                    type="email"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                    // Паттерн для валидации
                                    title="Введите действительный пароль"
                                />
                                <br/>
                               

                                <Button onClick={loginWithEmailAndPassword} color="primary" type='button'>Войти

                                </Button>
                            </Col>
                        </Row>
                    </Form>

                </Col>
                <Col className="" sm="4"></Col>
            </Row>
}


{  step === 4 &&
            <Row>
                <Col className="" sm="4" xs="6"></Col>
                <Col sm="4" xs="6">
                    <Form>
                        <Row className="card">
                            <Col>
                                <Label>
                                    Введите email и пароль
                                </Label>
                                <Input id="outlined-basic" variant="outlined" 
                                    value={email}
                                    onChange={handleChangeEmail}
                                    type="email"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                    // Паттерн для валидации
                                    title="Введите действительный адрес электронной почты"
                                />
                                 <Input id="outlined-basic" variant="outlined" 
                                    value={password}
                                    onChange={handleChangePassword}
                                    type="email"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                    // Паттерн для валидации
                                    title="Введите действительный пароль"
                                />
                                <br/>
                               

                                <Button onClick={loginInspectorWithEmailAndPassword} color="primary">Войти

                                </Button>
                            </Col>
                        </Row>
                    </Form>

                </Col>
                <Col className="" sm="4"></Col>
            </Row>
}

            {/* <main>

                <CssBaseline/> {
                step === 1 && <Container fixed>
                    <div className='formRegister'>
                        <div className="loginForm">
                            <div className="card">
                                <div>
                                    <form action="">
                                        <br/>
                                        <Typography variant="h6" gutterBottom className='center'>
                                            Введите свой Email
                                        </Typography>

                                        <div></div>
                                        <br/>
                                        <div spacing={2}>
                                            <TextField id="outlined-basic" variant="outlined" fullWidth
                                                value={email}
                                                onChange={handleChangeEmail}
                                                type="email"
                                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                                // Паттерн для валидации
                                                title="Введите действительный адрес электронной почты"
                                            />
                                            <br/>
                                            <Button variant="contained"
                                                onClick={handleClick}>Продолжить</Button>
                                            <br/>
                                                <p></p>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Container>
            }
                {
                step === 2 && <Container fixed>

                    <div className='formRegister'>
                        <div className="loginForm">
                            <div className="card">
                                <div>
                                    <br/>
                                    <div className='padding10px'>
                                        <Typography variant="h6" gutterBottom className='center'>Отправили код на {email}</Typography>
                                    </div>
                                    <div className='padding10px'>
                                        <Typography variant="h6" gutterBottom className='center'>Введите код чтобы подтвердить что это вы, а не кто-то другой</Typography>
                                    </div>
                                    <form action="">
                                        <br/>
                                        <div className='padding10px'>
                                            <TextField id="outlined-basic" variant="outlined" placeholder='Введите код' size="small" className='clearStyles'
                                                disabled={
                                                    !isInputEnabled
                                                }
                                                value={code}
                                                onChange={handleInputChange}/>
                                        </div>
                                        {
                                        isWrongCode && <p>Неверный код. Попробуйте {minutes}:{
                                            seconds < 10 ? `0${seconds}` : seconds
                                        }</p>
                                    }
                                        <br/>
                                        <Button variant="contained"
                                            disabled={
                                                !isInputEnabled
                                            }
                                            onClick={handleCodeSubmit}>
                                            Продолжить
                                        </Button>
                                        <br/>
                                            <p></p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
            } </main> */}
        </>
    );
}