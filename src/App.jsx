import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import GamePage from "./pages/GamePage";
import HomePage from "./pages/HomePage";
import SignupLogin from "./pages/SignupLogin";
import FriendsPage from "./pages/FriendsPage";
import socket, { connectSocket } from "./services/socket";
import { userNameAtom } from "./utils/store/ChessAtom";

function App() {
  const setUsername = useSetAtom(userNameAtom);

  useEffect(() => {
    const onConnect = () => console.log("Socket connected:", socket.id);
    const onError = (err) => console.log("Socket error:", err.message);

    socket.on("connect", onConnect);
    socket.on("connect_error", onError);

    // ask the server if the cookie is valid; connect only if logged in
    fetch("http://localhost:3000/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success) {
          setUsername(data.username);
          connectSocket();
        }
      })
      .catch(() => {});

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onError);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/signup" element={<SignupLogin />} />
      <Route path="/login" element={<SignupLogin />} />
      <Route path="/friends" element={<FriendsPage />} />
    </Routes>
  );
}

export default App;