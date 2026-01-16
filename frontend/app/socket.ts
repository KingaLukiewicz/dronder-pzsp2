import { io } from "socket.io-client";

const URL = "http://localhost:5000/";

export const socket = io(URL, { autoConnect: false, auth: { token: "" } });



export function setupSocket(token: string) {
  if (socket.connected)
    socket.disconnect();

  // @ts-expect-error
  // Reason: socket gets `auth` as object not function
  socket.auth.token = token;
  socket.connect();
}
