import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMsg('Conta criada! Faça login.');
      setTimeout(() => navigate('/'), 1500);
    } else {
      setMsg('Erro ao criar conta');
    }
  };

  return (
    <div>
      <h1>Criar Conta</h1>
      {msg && <p>{msg}</p>}
      <form onSubmit={submit}>
        <input required placeholder="Nome" onChange={e => setForm({ ...form, name: e.target.value })} /><br/>
        <input required placeholder="E-mail" onChange={e => setForm({ ...form, email: e.target.value })} /><br/>
        <input required placeholder="Senha" type="password" onChange={e => setForm({ ...form, password: e.target.value })} /><br/>
        <button>Criar</button>
      </form>
      <button onClick={() => navigate('/')}>Voltar</button>
    </div>
  );
}