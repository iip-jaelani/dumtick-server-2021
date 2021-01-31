var router = require("express").Router();
var bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  rateLimit = require("express-rate-limit"),
  env = require("dotenv").config(),
  deviceDetector = require("device-detector-js"),
  MobileDetect = require("mobile-detect");
const { response } = require("express");
var _ = require("lodash");
const nodemailer = require("nodemailer");
const { mailSend } = require("../../controllers/mail");
const { admin } = require("../../firebase");
//

const models = require("../../models");
const userModel = models.user;
const sessionModel = models.session;
const notificationModel = models.notification;
const categoryModel = models.category_feature;
const categoriesModel = models.category;
const ticketModel = models.ticket;
const likeModel = models.like;

const { middleware } = require("../middleware");

//create
router.post("/create", (req, res) => {
  const body = {
    is_active: 1,
    ...req.body,
  };
  ticketModel
    .create(body)
    .then((resCreate) => {
      res.send({
        error: false,
        message: "success create ticket",
        response: resCreate,
      });
    })
    .catch((e) => {
      res.status(500).json({
        error: true,
        message: "internal server error",
      });
    });
});
// get all query start_time
router.get("/", middleware.auth, (req, res) => {
  ticketModel
    .findAll({
      order: [["updatedAt", "DESC"]],
      where: {
        start_time: req.query.start_time,
      },
      include: [
        {
          model: categoriesModel,
          as: "category",
          attributes: { exclude: ["updatedAt", "createdAt"] },
        },
        {
          model: likeModel,
          as: "likes",
          include: [
            {
              model: userModel,
              attributes: [
                "id",
                "name",
                "email",
                "number_phone",
                "img_profile",
              ],
              as: "userData",
            },
          ],
          attributes: { exclude: ["updatedAt", "createdAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    })
    .then((response) => {
      for (let d of response) {
        const findLike = _.find(d.like, { user_id: req.user });
        d.setDataValue("count_like", d.likes.length || 0);
        d.setDataValue("like", findLike ? true : false);
      }
      res.send({
        error: false,
        message: "success get ticket today",
        response,
      });
    })
    .catch((e) => {
      res.status(500).json({
        error: true,
        message: "internal server error",
      });
    });
});

// get all promo
router.get("/promo", middleware.auth, (req, res) => {
  console.log(req.user, "------------id data");
  ticketModel
    .findAll({
      order: [["updatedAt", "DESC"]],
      where: {
        start_time: req.query.start_time,
      },
      include: [
        {
          model: categoriesModel,
          as: "category",
          attributes: { exclude: ["updatedAt", "createdAt"] },
        },
        {
          model: likeModel,
          as: "likes",
          include: [
            {
              model: userModel,
              attributes: [
                "id",
                "name",
                "email",
                "number_phone",
                "img_profile",
              ],
              as: "userData",
            },
          ],
          attributes: { exclude: ["updatedAt", "createdAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    })
    .then((response) => {
      var responseResult = [];
      for (let dd of response) {
        if (dd.promo > 0) {
          responseResult.push(dd);
        }
      }
      for (let d of responseResult) {
        console.log(d.like);
        const findLike = _.find(d.likes, { user_id: req.user });
        console.log({ findLike });
        d.setDataValue("count_like", d.likes.length || 0);
        d.setDataValue("like", findLike ? true : false);
      }

      res.send({
        error: false,
        message: "success get ticket today",
        response: responseResult,
      });
    })
    .catch((e) => {
      res.status(500).json({
        error: true,
        message: "internal server error",
      });
    });
});

// get detail
router.get("/detail", middleware.auth, (req, res) => {
  ticketModel
    .findOne({
      where: {
        id: req.query.id,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: categoriesModel,
          as: "category",
          attributes: { exclude: ["updatedAt", "createdAt"] },
        },
        {
          model: likeModel,
          as: "likes",
          include: [
            {
              model: userModel,
              attributes: [
                "id",
                "name",
                "email",
                "number_phone",
                "img_profile",
              ],
              as: "userData",
            },
          ],
          attributes: { exclude: ["updatedAt", "createdAt"] },
        },
      ],
    })
    .then((response) => {
      const findLike = _.find(response.like, { user_id: req.user });
      if (response) {
        response.setDataValue("count_like", response.likes.length || 0);
        response.setDataValue("like", findLike ? true : false);
        res.send({
          error: false,
          message: "success get ticket today",
          response,
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

// get favorite
router.get("/favorite", middleware.auth, (req, res) => {
  likeModel
    .findAll({
      order: [["updatedAt", "DESC"]],
      where: {
        user_id: req.user,
      },
      attributes: { exclude: ["updatedAt"] },
      include: [
        {
          model: ticketModel,
          as: "ticketData",
          attributes: { exclude: ["updatedAt", "createdAt"] },
        },
      ],
    })
    .then((response) => {
      res.send({
        error: false,
        message: "success get ticket favorite",
        response: response,
      });
    })
    .catch((e) => {
      res.status(500).json({
        error: true,
        message: "internal server error",
      });
    });
});

module.exports = router;
