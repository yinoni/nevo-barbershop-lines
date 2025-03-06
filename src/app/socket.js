require('dotenv').config();

import { io } from "socket.io-client";
import {route} from './consts.js';

const socket = io(route, {
  autoConnect: false, // לא מתחבר אוטומטית עד שאתה אומר לו
});

export default socket;