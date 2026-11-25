import { io } from "socket.io-client";
import { ENV } from "../config/env";

// Empty API_URL -> undefined -> Socket.IO uses the page origin (Vite proxy in dev)
const socket = io(ENV.API_URL || undefined, {
  autoConnect: false,
  transports: ["polling"],   // Catalyst gateway fails on the WebSocket upgrade
  withCredentials: true,     // send cookies with the handshake
});

export function connectSocket() {
  if (!socket.connected) socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
}

export default socket;