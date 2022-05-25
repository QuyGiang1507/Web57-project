import './App.css';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import CreatePost from './pages/CreatePost/CreatePost';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="posts/create" element={<CreatePost />} />
        <Route path="auth" element={<Auth />} />
        <Route path="*" element={<div>404 Page</div>} />
      </Routes>
    </div>
  );
}

export default App;
