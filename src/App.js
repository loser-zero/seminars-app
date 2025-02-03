import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [seminars, setSeminars] = useState([]);

  // Получение данных с сервера
  useEffect(() => {
    fetch('http://localhost:3001/seminars')
      .then((response) => response.json())
      .then((data) => setSeminars(data))
      .catch((error) => console.error('Ошибка загрузки данных:', error));
  }, []);

  // Удаление семинара
  const deleteSeminar = (id) => {
    fetch(`http://localhost:3001/seminars/${id}`, { method: 'DELETE' })
      .then(() => setSeminars(seminars.filter((seminar) => seminar.id !== id)))
      .catch((error) => console.error('Ошибка удаления:', error));
  };

  return (
    <div>
      <h1>Список семинаров</h1>
      <ul>
        {seminars.map((seminar) => (
          <li key={seminar.id}>
            <h2>{seminar.title}</h2>
            <p>{seminar.description}</p>
            <button onClick={() => deleteSeminar(seminar.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;