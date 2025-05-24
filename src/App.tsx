import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
// import Chat from './pages/Chat';
import { useAuth } from './context/AuthContext';
import Chat from './pages/Chat';
import './App.css'

function App() {
  const {token} = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/chat"
          element={token ? <Chat /> : <Navigate to ="/login" />}
        />
        <Route path="*" element={<Navigate to ="login"/>}/>
      </Routes>
    </Router>
  )
}

export default App
