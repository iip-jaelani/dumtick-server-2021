const express = require("express"),
	bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8989;
const MobileDetect = require("mobile-detect");
const helmet = require("helmet");
const clc = require("cli-color");
var fs = require("fs");
var path = require("path");

var morgan = require("morgan");

const http = require("http").Server(app);
const io = require("socket.io")(http);
var cors = require("cors");

app.use(cors()); // Use this after the variable declaration

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
	flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use(helmet());

app.use(bodyParser.json());

app.use(express.static("public"));

app.use(require("./routes"));

app.set("socket", io);

var sessionMaps = [];
const connectionIo = (socket) => {
	socket.on("connect_user", (d) => {
		console.log(d);
		sessionMaps.push({
			id: d,
			client: socket.id,
		});
		console.log(clc.green("[user-connected]"), socket.id);
	});
	socket.on("disconnect", () => {
		console.log(clc.red("[user-disconnect]"), socket.id);
		var index = sessionMaps.findIndex((p) => p.client === socket.id);
		if (index != -1) {
			sessionMaps.splice(index, 1);
		}
	});
};
io.on("connection", connectionIo);

http.listen(port, () => console.log("LISTEN ON PORT", port));
