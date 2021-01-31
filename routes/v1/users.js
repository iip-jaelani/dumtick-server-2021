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
const notificationModel = models.notification;

const { middleware } = require("../middleware");
// limit request API for 30 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  statusCode: 200,
  message: {
    error: true,
    limitRequest: true,
    message: "Limit request, please waiting 30 minutes for refresh server",
  },
});

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
// REGISTER`
router.post("/register", limiter, (req, res) => {
  userModel
    .findOne({
      where: {
        email: req.body.email,
        number_phone: req.body.number_phone,
      },
    })
    .then(async (response) => {
      var body = {
        ...req.body,
        token: "",
        is_active: 0,
        img_profile: "",
        status: "",
        password: await hashPassWord(req.body.password),
      };
      const token = middleware.createToken({ ...body });
      body.token = token;
      if (!response) {
        userModel
          .create(body)
          .then((resCreate) => {
            res.send({
              error: false,
              message: "success register data",
              response: resCreate,
            });
          })
          .catch((e) => {
            console.log(e);
            res.send({
              error: true,
              message: "failed register data",
            });
          });
      } else {
        res.send({
          error: true,
          message: "user already exist",
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
// LOGIN

router.get("/verify", (req, res) => {
  userModel
    .findOne({
      where: {
        token: req.query.token,
      },
    })
    .then((response) => {
      userModel
        .update(
          { is_active: 1 },
          {
            where: {
              id: response.id,
            },
          }
        )
        .then((resUpdate) => {
          res.send({
            error: false,
            message: "success verify email",
          });
        });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({
        error: true,
        message: "internal server error",
      });
    });
});

router.post("/login", limiter, (req, res) => {
  userModel
    .findOne({
      where: {
        email: req.body.email,
      },
    })
    .then(async (response) => {
      if (response) {
        const compare = await comparePassWord(
          req.body.password,
          response.password
        );
        if (compare) {
          sessionModel
            .findOne({
              where: {
                session: req.headers["user-agent"],
              },
            })
            .then((resSession) => {
              sessionModel
                .create({
                  user_id: response.id,
                  session: req.headers["user-agent"],
                })
                .then((createSession) => {
                  notificationModel.create({
                    user_id: createSession.user_id,
                    message: JSON.stringify({
                      message: createSession.session,
                      title: "Login new devices",
                    }),
                    chanel_id: "notification",
                    is_read: 0,
                  });
                  const payload = {
                    notification: {
                      title: "New session",
                      body: "you login on another device",
                      android_channel_id: "notification-chanel",
                    },
                  };
                  admin
                    .messaging()
                    .sendToDevice(response.fcm_token, payload)
                    .then((resNotify) => {
                      console.log("Successfully sent message:", resNotify);
                    })
                    .catch((error) => {
                      console.log("Error sending message:", error);
                    });
                });
            })
            .catch((e) => {
              //
            });

          res.send({
            error: false,
            message: "Success login",
            response,
            session: req.headers["user-agent"],
          });
        } else {
          res.send({
            error: true,
            message: "Password wrong",
          });
        }
      } else {
        res.status(404).json({
          error: true,
          message: "Data not found",
        });
      }
    })
    .catch((e) => {
      console.log(e, "----------");
      res.status(500).json({
        error: true,
        message: "internal server error",
      });
    });
});

router.post("/forgot/password", limiter, (req, res) => {
  userModel
    .findOne({
      where: {
        email: req.body.email,
      },
    })
    .then((response) => {
      // mailSend(response.email, response.name).then((response) => {
      //   console.log(response);
      // });
      res.send({
        error: false,
        message: "success send email forgot password",
      });
    })
    .catch((e) => {
      res.status(500).json({
        error: true,
        message: "Internal sever error",
      });
    });
});

router.get("/profile", middleware.auth, (req, res) => {
  userModel
    .findOne({
      where: {
        id: req.user,
      },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    })
    .then((response) => {
      res.send({
        error: false,
        message: "success get detail profile",
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
router.get("/profile/:id", (req, res) => {
  userModel
    .findOne({
      where: {
        id: req.params.id,
      },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    })
    .then((response) => {
      res.send({
        error: false,
        message: "success get detail profile",
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
