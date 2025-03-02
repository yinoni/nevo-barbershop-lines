require('dotenv').config();

import { io } from "socket.io-client";
const production = true;
const route = production ? process.env.NEXT_PUBLIC_SERVER_URL : "http://localhost:5000";

const socket = io(route, {
  autoConnect: false, // לא מתחבר אוטומטית עד שאתה אומר לו
});

export default socket;