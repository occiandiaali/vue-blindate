import { Room } from "colyseus.js";
function sendMessage(message: string, r: Room) {
  r.send("message", message);
}

export default sendMessage;
