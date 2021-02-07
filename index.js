const express = require("express"),
  bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const MobileDetect = require("mobile-detect");
const helmet = require("helmet");
const clc = require("cli-color");

const http = require("http").Server(app);
const io = require("socket.io")(http);
var cors = require("cors");

app.use(cors()); // Use this after the variable declaration

app.use(helmet());

app.use(bodyParser.json());

app.use(express.static("public"));

app.use(require("./routes"));

app.set("socket", io);

io.on("connection", (socket) => {
  socket.emit("welcome", socket.id);
  console.log(clc.green("[user-connect]"), socket.id);
  socket.on("disconnect", () => {
    console.log(clc.red("[user-disconnect]"), socket.id);
  });
});

app.get("/", (req, res) => {
  const md = new MobileDetect(req.headers["user-agent"]);
  res.send({
    session: md,
  });
});

http.listen(port, () => console.log("LISTEN ON PORT", port));
