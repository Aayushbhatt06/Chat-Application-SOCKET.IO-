import { io, Socket } from "socket.io-client";


export const createSocketConnection = (): Socket => {
  return io(import.meta.env.VITE_BACKEND_URL);
};
