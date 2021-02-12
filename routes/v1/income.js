var router = require("express").Router();
const { Op, col, literal, fn } = require("sequelize");

var bcrypt = require("bcryptjs"),
	jwt = require("jsonwebtoken"),
	rateLimit = require("express-rate-limit"),
	env = require("dotenv").config(),
	deviceDetector = require("device-detector-js"),
	MobileDetect = require("mobile-detect");
const { response } = require("express");
const nodemailer = require("nodemailer");
const moment = require("moment");
const _ = require("lodash");
const { mailSend } = require("../../controllers/mail");

const { admin } = require("../../firebase");
//

const models = require("../../models");
const userModel = models.user;
const transactionModel = models.transaction;
const sessionModel = models.session;
const notificationModel = models.notification;
const ticketModel = models.ticket;
const categoryModel = models.category_feature;
const categoriesModel = models.category;
const likeModel = models.like;

const { middleware } = require("../middleware");
const formatPrice = require("../config/formatPrice");
const monthsAndDays = require("../config/monthsAndDays");

router.get("/per_day", (req, res) => {
	const date = (t) => new Date(t).getTime();
	const start = new Date(date(req.query.start));
	const end = new Date(date(req.query.end) + 86400000);
	transactionModel
		.findAll({
			where: {
				createdAt: {
					[Op.between]: [start, end],
				},
			},
			attributes: ["id", "price"],
		})
		.then((result) => {
			res.send({
				error: false,
				message: "success get list order with range date",
				order: result.length,
				income: formatPrice.convert(_.sumBy(result, "price")),
				start_time: start,
				end_time: end,
				timestamp: new Date().getTime(),
			});
		})
		.catch((e) => {
			res.status(500).json({
				error: true,
				message: e.message,
			});
		});
});
router.get("/statistic", (req, res) => {
	const date = (t) => new Date(t).getTime();
	const start = new Date(date(req.query.start));
	const end = new Date(date(req.query.end) + 86400000);
	transactionModel
		.findAll({
			where: {
				createdAt: {
					[Op.between]: [start, end],
				},
			},
			attributes: [
				[fn("SUM", col("price")), "price"],
				[fn("date", col("createdAt")), "date"],
			],

			group: [fn("date", col("createdAt")), "date"],
			logging: console.log,
			raw: true,
		})
		.then((result) => {
			console.log(result);
			res.send({
				// error: false,
				// message: "success get statistic order",
				// date: [
				// 	{ start_date: new Date(req.query.start).getTime() },
				// 	{ end_date: new Date(req.query.end).getTime() },
				// ],
				// month: `${moment(req.query.start).format("MMMM")} - ${moment(
				// 	req.query.end
				// ).format("MMMM")}`,
				// day: `${moment(req.query.start).format("dddd")} - ${moment(
				// 	req.query.end
				// ).format("dddd")}`,
				data: result,
				// label: monthsAndDays.days(),
				timestamp: new Date().getTime(),
			});
		})
		.catch((e) => {
			res.status(500).json({
				error: true,
				message: e.message,
			});
		});
});

module.exports = router;
