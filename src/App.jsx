import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import GamePage from "./pages/GamePage";
import HomePage from "./pages/HomePage";
import SignupLogin from "./pages/SignupLogin";
import FriendsPage from "./pages/FriendsPage";
import socket, { connectSocket } from "./services/socket";
import { userNameAtom } from "./utils/store/ChessAtom";
import { useState } from "react";
import { onlineUsersAtom, userIdAtom } from "./utils/store/authAtom";
import toast from "react-hot-toast";
import { friendsDataAtom, refreshFriendsAtom } from "./utils/store/friendsAtom";

function App() {
  const setUsername = useSetAtom(userNameAtom);
  const [onlineUsers, setOnlineUsers] = useAtom(onlineUsersAtom);
  const [friendsData, setFriensData] = useAtom(friendsDataAtom);
  const userId = useAtomValue(userIdAtom);
  const [refreshFriends, setRefreshFriends] = useAtom(refreshFriendsAtom);

    useEffect(()=>{
        console.log(onlineUsers);
    },[onlineUsers])


  useEffect(() => {
    const onConnect = () => console.log("Socket connected:", socket.id);
    const onError = (err) => console.log("Socket error:", err.message);
    const onRecevedFriendRequiest = (res) => toast(`${res.message}!`,{icon: '🙌',style: {borderRadius: '10px',},});;
    const onFrendRequestAccept = (res) => {
      toast.success(res.message);
      setRefreshFriends((prev)=> prev + 1);
    }

    socket.on("connect", onConnect);
    socket.on("connect_error", onError);
    socket.on("onlineUsersUpdate", (users)=>{
                  setOnlineUsers(new Set(users));
              });
    socket.on("newFriendRequest", onRecevedFriendRequiest);
    socket.on("friendRequestAccepted", onFrendRequestAccept)

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
      socket.off("onlineUsersUpdate");
      socket.off("newFriendRequest", onRecevedFriendRequiest);
      socket.off("friendRequestAccepted", onFrendRequestAccept);
    };
  }, []);

     useEffect(() => {
        if (!userId) return;

           const loadFriendsData = () => {
               socket.emit("getFriendsData", { userId }, (response) => {
                    if (response.success) {
                        setFriensData({
                        friends: response.friends,
                        requests: response.requests,
                        rejected: response.rejected,
                        });
                    }
                    });
                };

                loadFriendsData();                                // initial load
                socket.on("newFriendRequest", loadFriendsData);   // live update

                return () => {
                    socket.off("newFriendRequest", loadFriendsData);
                };
        }, [userId, setFriensData, refreshFriends]);

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