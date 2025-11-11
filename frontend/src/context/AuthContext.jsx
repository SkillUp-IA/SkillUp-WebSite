// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../lib/api.js';

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  // persiste no localStorage
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (username) localStorage.setItem('username', username);
    else localStorage.removeItem('username');
  }, [username]);

  async function login(user, pass) {
    const res = await apiLogin(user, pass); // { message, token }
    setToken(res.token);
    setUsername(user);
    return res;
  }

  async function register(user, pass) {
    await apiRegister(user, pass); // { message, user }
    return true;
  }

  function logout() {
    setToken('');
    setUsername('');
  }

  return (
    <AuthCtx.Provider value={{ token, username, isAuth: !!token, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
