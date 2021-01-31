const jwt = require("jsonwebtoken"),
  env = require("dotenv").config();
const models = require("../models");
const userModel = models.user;
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const user = await userModel.findOne({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new Error();
    }
    req.user = user.id;
    next();
  } catch (err) {
    res
      .status(401)
      .send({ error: true, message: "Not authorized to access this resource" });
  }
};

const createToken = (data) => {
  const token = jwt.sign(data, process.env.SECRET_KEY);
  return token;
};

exports.middleware = {
  auth,
  createToken,
};
