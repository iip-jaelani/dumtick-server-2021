var router = require("express").Router();
var bcrypt = require("bcryptjs"),
	jwt = require("jsonwebtoken"),
	rateLimit = require("express-rate-limit"),
	env = require("dotenv").config(),
	deviceDetector = require("device-detector-js"),
	MobileDetect = require("mobile-detect");
const { response } = require("express");
const nodemailer = require("nodemailer");
const { mailSend } = require("../../controllers/mail");

//

const models = require("../../models");
const agentModel = models.agent;

//generated password when register
async function hashPassWord(pass) {
	var getSalt = await bcrypt.genSalt(10);
	var hashing = bcrypt.hashSync(pass, getSalt);
	return hashing;
}
// compare password for login
async function comparePassWord(pass, hashPass) {
	var compare = await bcrypt.compare(pass, hashPass);
	return compare;
}
const { middleware } = require("../middleware");

router.post("/login", (req, res) => {
	agentModel
		.findOne({
			where: {
				email: req.body.email,
			},
		})
		.then((agent) => {
			if (agent) {
				res.send({
					message: "success",
					error: false,
					response: agent,
				});
			}
		})
		.catch((error) => {
			res.status(500).json({ error: true, message: error.message });
		});
});

router.post("/register", (req, res) => {
	agentModel
		.findOne({
			where: {
				email: req.body.email,
			},
		})
		.then(async (agent) => {
			if (!agent) {
				var body = {
					...req.body,
					password: await hashPassWord(req.body.password),
					is_active: 0,
				};
				console.log(body);
				const token = middleware.createToken({ ...body });
				body.token = token;
				agentModel
					.create(body)
					.then((success) => {
						console.log({ success });
						res.send({
							error: false,
							message: "success register agent",
							response: success,
						});
					})
					.catch((error) => {
						console.log(error);
						res.status(500).json({ error: true, message: error.message });
					});
			} else {
				res.send({
					message: "Email already exists",
					error: true,
				});
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ error: true, message: error.message });
		});
});

module.exports = router;
