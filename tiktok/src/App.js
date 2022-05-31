import './App.css';
import react, { useState, useEffect, createContext } from 'react';
import request from './api/request';
import HomeListAll from './pages/Home/HomeListAll';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import CreatePost from './pages/CreatePost/CreatePost';
import PrivateRoute from './components/Route/PrivateRoute';
import GuestRoute from './components/Route/GuestRoute';
import { Routes, Route } from "react-router-dom";

export const AuthContext = createContext();

function App() {
  const [userInfo, setUserInfo] = useState({
    status: 'idle',
    data: null,
  });

  const verifyUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUserInfo({ status: 'success', data: null });
      return;
    }

    try {
      const res = await request.get('/api/auth/verify');
      if (res.data.success) {
        setUserInfo({ status: 'success', data: res.data.data });
      } else {
        setUserInfo({ status: 'success', data: null });
      }
      console.log(userInfo);
    } catch (err) {
      setUserInfo({ status: 'success', data: null });
    }
  }

  const login = ({ token, returnUrl }) => {
    localStorage.setItem('token', token);
    window.location.href = returnUrl ?? '/';
  }

  const logout = () => {
    localStorage.removeItem('token');
    setUserInfo({ status: 'success', data: null });
  }

  useEffect(() => {
    verifyUserInfo();
  }, []);

  if (userInfo.status === "idle" || userInfo.status === "loading") return <div>Loading...</div>;

  if (userInfo.status === "error") return <div>Error</div>

  return (
    <div className="app">
      <AuthContext.Provider value={{ user: userInfo.data, login, logout }}>
        <Routes>
          <Route path="/test" element={<HomeListAll />} />
          <Route path="" element={<Home />} />
          <Route element={<PrivateRoute  />}>
            <Route path="posts/create" element={<CreatePost />} />
          </Route>
          <Route element={<GuestRoute />}>
            <Route path="auth" element={<Auth />} />
          </Route>
          <Route path="*" element={<div>404 Page</div>} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
