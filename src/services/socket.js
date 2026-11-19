import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,     // send cookies with the handshake
});

export function connectSocket() {
  if (!socket.connected) socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
}

export default socket;