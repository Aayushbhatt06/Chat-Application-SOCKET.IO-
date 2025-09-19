import io from "socket.io-client";

export const createSocketConnection = () => {
  return io("http://3.108.61.73:3000");
};
