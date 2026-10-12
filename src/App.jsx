import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import GamePage from "./pages/GamePage";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import socket from "./services/socket";
import SignUp from "./pages/SignUp";

function App() {
  const location = useLocation();
  useEffect(()=>{
       if(location.pathname == "/home") { socket.disconnect() }
  }, [location.pathname])
  return (
     <Routes>
           <Route path="/" element={<Navigate to="/home" replace />} />
           <Route path="/game" element={<GamePage />} />
           <Route path="/home" element={<HomePage />} />
           <Route path="/signup" element={<SignUp />} />
     </Routes>
  )
}

export default App
