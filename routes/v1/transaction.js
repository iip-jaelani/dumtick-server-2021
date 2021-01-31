var router = require("express").Router();
var bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  rateLimit = require("express-rate-limit"),
  env = require("dotenv").config(),
  deviceDetector = require("device-detector-js"),
  MobileDetect = require("mobile-detect");
const nodemailer = require("nodemailer");
const { mailSend } = require("../../controllers/mail");

const { admin } = require("../../firebase");
//

const models = require("../../models");
const userModel = models.user;
const sessionModel = models.session;
const ticketModel = models.ticket;
const categoryModel = models.category;
const notificationModel = models.notification;
const transactionModel = models.transaction;

const { middleware } = require("../middleware");

router.post("/create", middleware.auth, (req, res) => {
  ticketModel
    .findOne({
      where: {
        id: req.body.ticket_id,
      },
    })
    .then((responseTicket) => {
      if (responseTicket) {
        if (responseTicket.stock >= req.body.quantity) {
          transactionModel
            .create({
              ...req.body,
              user_id: req.user,
              promo: responseTicket.promo,
            })
            .then((response) => {
              res.send({
                error: false,
                message: "success create transaction",
                response,
              });
            })
            .catch((e) => {
              res.status(500).json({
                error: true,
                message: "Internal sever error",
              });
            });
        } else {
          res.send({
            error: true,
            message: "insufficient stock",
          });
        }
      } else {
        res.send({
          error: true,
          message: "ticket not found",
        });
      }
    })
    .catch((e) => {
      res.status(500).json({
        error: true,
        message: "Internal sever error",
      });
    });
});

router.post("/update_status/:id", middleware.auth, (req, res) => {
  var status = [
    "belum dibayar",
    "pembayaran diterima",
    "pesanan dikonfirmasi",
    "pesanan selesai",
  ];
  transactionModel
    .findOne({
      where: {
        id: req.params.id,
      },
      raw: true,
    })
    .then((response) => {
      ticketModel
        .findOne({
          where: {
            id: response.ticket_id,
          },
        })
        .then((responseTicket) => {
          if (responseTicket) {
            if (responseTicket.stock >= response.quantity) {
              transactionModel
                .update(
                  {
                    status: status[req.body.type],
                  },
                  {
                    returning: true,
                    where: {
                      id: req.params.id,
                    },
                  }
                )
                .then((resUpdate) => {
                  if (req.body.type === 3) {
                    ticketModel.update(
                      {
                        stock: responseTicket.stock - response.quantity,
                      },
                      {
                        where: {
                          id: response.ticket_id,
                        },
                      }
                    );
                  }
                  res.send({
                    error: false,
                    message: "update status success",
                    response: response,
                  });
                })
                .catch((e) => {
                  console.log(e, "--e");
                  res.status(500).json({
                    error: true,
                    message: "Internal sever error",
                  });
                });
            } else {
              res.send({
                error: true,
                message: "insufficient stock",
              });
            }
          } else {
            res.send({
              error: true,
              message: "ticket not found",
            });
          }
        })
        .catch((e) => {
          res.status(500).json({
            error: true,
            message: "Internal sever error",
          });
        });
    })
    .catch((e) => {
      res.status(500).json({
        error: true,
        message: "Internal sever error",
      });
    });
});

router.get("/histories", middleware.auth, (req, res) => {
  transactionModel
    .findAll({
      where: {
        user_id: req.user,
      },
      attributes: { exclude: ["updatedAt"] },
    })
    .then((response) => {
      res.send({
        error: false,
        message: "success get history",
        response,
      });
    })
    .catch((e) => {
      res.status(500).json({
        error: true,
        message: "Internal sever error",
      });
    });
});

router.get("/detail/:id", middleware.auth, (req, res) => {
  transactionModel
    .findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: ticketModel,
          as: "ticketData",
          attributes: {
            exclude: ["updatedAt", "is_active", "id_category"],
          },
          include: [
            {
              model: categoryModel,
              as: "category",
              attributes: {
                exclude: ["updatedAt", "createdAt", "is_active", "image"],
              },
            },
          ],
        },
        {
          model: userModel,
          attributes: ["id", "name", "email", "number_phone", "img_profile"],
          as: "userData",
        },
      ],
      attributes: {
        exclude: ["user_id", "ticket_id", "updatedAt"],
      },
    })
    .then((response) => {
      const disableUpdateStatus =
        response.quantity - response.ticketData.stock > 0;
      response.setDataValue("disable_update", disableUpdateStatus);
      res.send({
        error: false,
        message: "success get detail history",
        response,
      });
    })
    .catch((e) => {
      res.status(500).json({
        error: true,
        message: "Internal sever error",
      });
    });
});

module.exports = router;
