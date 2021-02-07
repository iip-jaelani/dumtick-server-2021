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

const { admin } = require("../../firebase");
//

const models = require("../../models");
const userModel = models.user;
const sessionModel = models.session;
const notificationModel = models.notification;
const ticketModel = models.ticket;
const categoryModel = models.category_feature;
const categoriesModel = models.category;
const likeModel = models.like;

const { middleware } = require("../middleware");

router.get("/notif_listener/:socketId", (req, res) => {
  const socket = req.app.get("socket");
  //   console.log(socket.io);
  notificationModel
    .findOne({
      where: {
        user_id: req.query.user_id,
      },
    })
    .then((resNotify) => {
      socket.to(req.params.socketId).emit("notification_data", resNotify);
      res.send({
        resNotify,
      });
    })
    .catch((e) => {
      res.status(500).json({
        message: e.message,
      });
    });
});

router.get("/user_notif", middleware.auth, (req, res) => {
  const socket = req.app.get("socket");
  notificationModel
    .findOne({
      where: {
        user_id: req.user,
      },
    })
    .then((resNotify) => {
      if (resNotify) {
        res.send({
          message: "success get list notify",
          response: resNotify,
        });
      } else {
        res.status(404).json({
          message: "data not found",
        });
      }
    })
    .catch((e) => {
      res.status(500).json({
        message: e.message,
      });
    });
});

module.exports = router;
