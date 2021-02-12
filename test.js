const io = require("socket.io-client");
let socket = io.connect("http://localhost:3045");
var { v4: uuid } = require("uuid");
const id = uuid();
socket.emit("new_userId", id.slice(0, 4));
