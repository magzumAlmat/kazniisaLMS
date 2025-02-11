import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const initialTime = 300; // Начальное время в секундах
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      if (time > 0) {
        setTime(time - 1);
      } else {
        clearInterval(timer);
        // Выполните действия, когда таймер достигнет нуля
        // Например, отобразите сообщение об окончании времени
        alert('Время истекло');
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

  return (
    <div>
      <p>
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>
    </div>
  );
};

export default CountdownTimer;
