import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [seminars, setSeminars] = useState([]);
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '' });

  // Получение данных с сервера
  useEffect(() => {
    fetch('http://localhost:3001/seminars')
      .then((response) => response.json())
      .then((data) => setSeminars(data))
      .catch((error) => console.error('Ошибка загрузки данных:', error));
  }, []);

  // Удаление семинара
  const deleteSeminar = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот семинар?')) {
      fetch(`http://localhost:3001/seminars/${id}`, { method: 'DELETE' })
        .then(() => setSeminars(seminars.filter((seminar) => seminar.id !== id)))
        .catch((error) => console.error('Ошибка удаления:', error));
    }
  };

  // Открытие модального окна для редактирования
  const openEditModal = (seminar) => {
    setSelectedSeminar(seminar);
    setFormData({
      title: seminar.title,
      description: seminar.description,
      date: seminar.date,
      time: seminar.time,
    });
    setIsEditing(true);
  };

  // Обработка изменения формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Сохранение изменений семинара
  const saveChanges = () => {
    if (!selectedSeminar) return;

    fetch(`http://localhost:3001/seminars/${selectedSeminar.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...selectedSeminar,
        ...formData,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Ошибка при обновлении данных');
        return response.json();
      })
      .then((updatedSeminar) => {
        // Обновляем локальное состояние
        setSeminars((prevSeminars) =>
          prevSeminars.map((seminar) =>
            seminar.id === updatedSeminar.id ? updatedSeminar : seminar
          )
        );
        closeEditModal();
      })
      .catch((error) => console.error('Ошибка обновления:', error));
  };

  // Закрытие модального окна
  const closeEditModal = () => {
    setIsEditing(false);
    setSelectedSeminar(null);
    setFormData({ title: '', description: '', date: '', time: '' });
  };

  return (
    <div>
      <h1>Список семинаров</h1>
      <ul>
        {seminars.map((seminar) => (
          <li key={seminar.id}>
            <h2>{seminar.title}</h2>
            <p>{seminar.description}</p>
            <p>
              Дата: {seminar.date} | Время: {seminar.time}
            </p>
            <button onClick={() => deleteSeminar(seminar.id)}>Удалить</button>
            <button onClick={() => openEditModal(seminar)}>Редактировать</button>
          </li>
        ))}
      </ul>

      {/* Модальное окно */}
      {isEditing && (
        <div className="modal">
          <h2>Редактирование семинара</h2>
          <label>
            Название:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Название"
            />
          </label>
          <label>
            Описание:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Описание"
            ></textarea>
          </label>
          <label>
            Дата:
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
          </label>
          <label>
            Время:
            <input type="time" name="time" value={formData.time} onChange={handleChange} />
          </label>
          <button onClick={saveChanges}>Сохранить изменения</button>
          <button onClick={closeEditModal}>Закрыть</button>
        </div>
      )}
    </div>
  );
};

export default App;