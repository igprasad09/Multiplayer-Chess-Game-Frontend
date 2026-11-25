import { io } from "socket.io-client";
import { ENV } from "../config/env";

// Empty API_URL -> undefined -> Socket.IO uses the page origin (Vite proxy in dev, Vercel rewrite in prod)
const socket = io(ENV.API_URL || undefined, {
  autoConnect: false,
  transports: ["polling"],
  withCredentials: true,
  addTrailingSlash: false,
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionDelayMax: 3000,
});

// Debug logs: remove once the disconnects are sorted out
socket.on("disconnect", (reason) => console.log("socket disconnected:", reason));
socket.on("connect_error", (err) => console.log("socket connect_error:", err.message));

export function connectSocket() {
  if (!socket.connected) socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
}

export default socket;