import { io } from "socket.io-client";
import { ENV } from "../config/env";

// Empty API_URL -> undefined -> Socket.IO uses the page origin (Vite proxy in dev)
const socket = io(ENV.API_URL || undefined, {
  autoConnect: false,
  transports: ["polling"],
  withCredentials: true,
  addTrailingSlash: false,
});

export function connectSocket() {
  if (!socket.connected) socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
}

export default socket;