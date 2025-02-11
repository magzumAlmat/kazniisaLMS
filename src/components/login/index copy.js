import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
    Grid,
    Button,
    CardActionArea,
    CardActions,
    TextField
} from '@mui/material';
import headerOnTop from '../header';
import {useState,useEffect} from 'react';
import { useRouter } from 'next/navigation';
import Paper from '@mui/material';


export default function Login() {

  const initialTime = 30; // Начальное время в секундах
  const [time, setTime] = useState(initialTime);
  const [isInputEnabled, setInputEnabled] = useState(true);
  const [isWrongCode, setIsWrongCode] = useState(false);
  const [code, setCode] = useState(null);

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
    return () => {
      clearInterval(timer);
    };
  }, [time]);

  // Форматирование времени в минуты и секунды
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const handleInputChange = (event) => {
    
    if (time > 0 && !isWrongCode) {
      // Разрешить ввод только если отсчет еще не закончился и не введен неверный код
      setInputEnabled(true);
    } else {
      setInputEnabled(false);
    }
  };

  const handleCodeSubmit = (event) => {
    console.log('code=',event.target.value,typeof(event.target.value))
    
    console.log(code)

    if (code == '4567') {
      setInputEnabled(true); // Разрешить ввод
      router.push('/layout')
    } else {
      setIsWrongCode(true);
      setInputEnabled(false);
      setTime(15); // Блокировать на 3 минуты
    }
  };





  const router=useRouter()
    const [email, setEmail] = useState('');
    const handleClick = () => {
        setStep(2)

    }

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    };
    const [step, setStep] = useState(1)
    return (
        <>

            <React.Fragment>
                <CssBaseline/>
              {
                step === 1 && <Container fixed>
                    <div className='formRegister'>
                        <div className="loginForm">
                            <div className="card">
                                <form action="">
                                    <Typography variant="h4" gutterBottom className='center'>
                                        Введите свой Email
                                    </Typography>

                                    <div></div>
                                    <div spacing={2}>
                                        <TextField id="outlined-basic" variant="outlined"
                                            value={email}
                                            onChange={handleChangeEmail}/>
                                        <Button variant="contained"
                                            onClick={handleClick}>Продолжить</Button>
                                    </div>
                                </form>
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
                                <Typography variant="h4" gutterBottom className='center'>Код отправлен на адрес {email}</Typography>
                                <Typography variant="h6" gutterBottom className='center'>Введите код чтобы подтвердить что это вы, а не кто-то другой</Typography>
                                <form action="">
                                    <TextField id="outlined-basic" variant="outlined" placeholder='Введите код'
                                     disabled={!isInputEnabled}
                                     value={code}
                                     onChange={handleInputChange}/>
                                    <Typography variant="h6" gutterBottom className='center'

                                     
                                      
                                    />

                                    {isWrongCode && <p>Неверный код. Попробуйте через 30 секунд</p>}
                                    <Button variant="contained"
                                     disabled={!isInputEnabled}
                                        onClick={handleCodeSubmit}
                                    >Продолжить</Button>

                                </form>
                            </div>

                        </div>
                    </div>
                </Container>
            } </React.Fragment>
        </>
    );
}

