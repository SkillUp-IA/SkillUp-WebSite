// src/components/AuthBar.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthBar() {
  const { isAuth, username, login, register, logout } = useAuth();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuth) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">Olá, <b>{username}</b></span>
        <button onClick={logout} className="px-3 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-sm">Sair</button>
      </div>
    );
  }

  async function doLogin() {
    try { setLoading(true); await login(user, pass); }
    catch (e) { alert(e.message); }
    finally { setLoading(false); }
  }
  async function doRegister() {
    try { setLoading(true); await register(user, pass); }
    catch (e) { alert(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="flex items-center gap-2">
      <input value={user} onChange={e => setUser(e.target.value)}
             placeholder="usuário" className="px-2 py-2 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800"/>
      <input value={pass} onChange={e => setPass(e.target.value)} type="password"
             placeholder="senha" className="px-2 py-2 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800"/>
      <button onClick={doLogin} disabled={loading}
              className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-sm disabled:opacity-60">Entrar</button>
      <button onClick={doRegister} disabled={loading}
              className="px-3 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-sm disabled:opacity-60">Registrar</button>
    </div>
  );
}
