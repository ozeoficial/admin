import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      setMsg('Credenciais inválidas');
    }
  };

  return (
    <div>
      <h1>Início de Sessão</h1>
      {msg && <p style={{color: 'red'}}>{msg}</p>}
      <form onSubmit={submit}>
        <input required placeholder="E-mail" onChange={e => setForm({ ...form, email: e.target.value })} /><br/>
        <input required placeholder="Senha" type="password" onChange={e => setForm({ ...form, password: e.target.value })} /><br/>
        <button>Entrar</button>
      </form>
      <button onClick={() => navigate('/register')}>Criar conta</button>
    </div>
  );
}