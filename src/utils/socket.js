import { io } from "socket.io-client";

let socket;

export function initSocket(user) {
  if (!socket) {
    socket = io("http://localhost:5000", {
      withCredentials: true
    });

    socket.on("connect", () => {
      console.log("⚡ Connected to socket:", socket.id);

      //  JOIN ROOMS
      socket.emit("join", {
        userId: user.id,
        role: user.role
      });
    });
  }

  return socket;
}

export function getSocket() {
  return socket;
}