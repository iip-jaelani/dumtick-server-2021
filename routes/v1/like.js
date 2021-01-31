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

router.post("/update", middleware.auth, (req, res) => {
  likeModel
    .findOne({
      where: {
        user_id: req.user,
        ticket_id: req.body.ticket_id,
      },
    })
    .then((response) => {
      if (response) {
        likeModel
          .destroy({
            where: {
              id: response.id,
            },
          })
          .then((resDelete) => {
            res.send({
              error: false,
              message: "success unlike ticket",
              response: resDelete,
            });
          });
      } else {
        likeModel.create({ ...req.body, user_id: req.user }).then((likeRes) => {
          res.send({
            error: false,
            message: "success like ticket",
            response: likeRes,
          });
        });
      }
    })
    .catch((e) => {
      res.status(500).json({
        error: true,
        message: "internal server error",
      });
    });
});

module.exports = router;
