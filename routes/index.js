var router = require("express").Router();

router.use("/api/v1", require("./v1"));

router.all("*", function (req, res) {
  res.status(404).json({
    error: true,
    message: "Not authorized to access this resource",
  });
});

module.exports = router;
