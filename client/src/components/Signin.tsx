import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Signin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/signin', { username, password });
      signin(data.token);
      navigate('/bookshelf');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <>
    <Header />
      <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
  <input
    type="text"
    value={username}
    onChange={e => setUsername(e.target.value)}
    placeholder="Username"
    autoComplete="username"
  />
  <input
    type="password"
    value={password}
    onChange={e => setPassword(e.target.value)}
    placeholder="Password"
    autoComplete="current-password"
  />
  <button type="submit">Sign In</button>
  {error && <p>{error}</p>}
</form>

      </div>
    </>
  );
};

export default Signin;
