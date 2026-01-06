import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    fetch('http://localhost:3001/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : navigate('/'))
      .then(data => setData(data));
  }, [navigate]);

  if (!data) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Bem-vindo {data.name}</h1>
      <p>Cargos: {data.roles.join(', ')}</p>
      <button onClick={() => {
        localStorage.removeItem('token');
        navigate('/');
      }}>Sair</button>
    </div>
  );
}