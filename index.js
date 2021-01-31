const express = require("express"),
  bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const useragent = require("express-useragent");
const MobileDetect = require("mobile-detect");
const helmet = require("helmet");
app.use(helmet());

app.get("/", (req, res) => {
  const md = new MobileDetect(req.headers["user-agent"]);
  res.send({
    session: md,
  });
});

const server = app.listen(port, () => console.log("LISTEN ON PORT", port));

var io = require("socket.io")(server);

app.use(function (req, res, next) {
  res.io = io;
  next();
});

app.use(bodyParser.json());

app.use(express.static("public"));

app.use(require("./routes"));
