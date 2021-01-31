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
const { upload } = require("../config/uploadConfig");
const userModel = models.user;
const sessionModel = models.session;
const notificationModel = models.notification;
const ticketModel = models.ticket;
const categoryModel = models.category_feature;
const categoriesModel = models.category;

const { middleware } = require("../middleware");
// limit request API for 30 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6, // limit each IP to 100 requests per windowMs
  message: {
    error: true,
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
router.post("/create", limiter, (req, res) => {
  categoryModel
    .findOne({
      where: {
        name: req.body.name,
      },
    })
    .then((response) => {
      if (!response) {
        categoryModel.create({ ...req.body }).then((resCreate) => {
          res.send({
            error: false,
            message: "success create category",
            response: resCreate,
          });
        });
      } else {
        res.send({
          error: false,
          message: "failed create category",
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

router.get("/", middleware.auth, (req, res) => {
  categoryModel
    .findAll({
      // include: "tickets_list",
    })
    .then((response) => {
      if (response) {
        res.send({
          error: true,
          message: "success get category",
          response,
        });
      } else {
        res.status(404).json({
          error: false,
          message: "not found category",
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

router.get("/detail", middleware.auth, (req, res) => {
  categoryModel
    .findAll({
      where: {
        id: req.query.id,
      },
      include: [
        {
          model: ticketModel,
          as: "tickets_list",
          attributes: { exclude: ["updatedAt"] },
        },
      ],
      attributes: { exclude: ["updatedAt"] },
    })
    .then((response) => {
      if (response) {
        res.send({
          error: true,
          message: "success get detail category",
          response,
        });
      } else {
        res.status(404).json({
          error: false,
          message: "not found category",
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

router.post("/create/category_ticket", upload.single("image"), (req, res) => {
  console.log(req.file);
  const { name, image, is_active } = req.body;
  var filePath = null;
  if (req.file) filePath = `${req.file.filename}`;
  // filePath = `${req.protocol}://${req.hostname}/uploads/${req.file.filename}`; dev
  const body = {
    name,
    image: filePath,
    is_active,
  };
  categoriesModel
    .findOne({
      where: {
        name: req.body.name,
      },
    })
    .then((response) => {
      if (!response) {
        categoriesModel.create(body).then((resCreate) => {
          res.send({
            error: false,
            message: "success create category",
            response: resCreate,
          });
        });
      } else {
        res.send({
          error: true,
          message: "category already exist",
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

router.get("/:id/tickets", (req, res) => {
  categoriesModel
    .findAll({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: ticketModel,
          as: "tickets_list",
          attributes: { exclude: ["updatedAt", "createdAt"] },
        },
      ],
      attributes: { exclude: ["updatedAt", "createdAt"] },
    })
    .then((response) => {
      res.send({
        error: false,
        message: "success get category and tickets",
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

router.get("/all", middleware.auth, (req, res) => {
  categoriesModel
    .findAll({
      attributes: { exclude: ["updatedAt", "createdAt"] },
    })
    .then((response) => {
      res.send({
        error: false,
        message: "success get all category",
        response: {
          category: response,
        },
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
