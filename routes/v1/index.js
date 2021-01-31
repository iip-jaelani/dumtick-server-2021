var router = require("express").Router();

router.use("/users", require("./users"));
router.use("/category", require("./category"));
router.use("/ticket", require("./tickets"));
router.use("/like", require("./like"));
router.use("/transaction", require("./transaction"));

module.exports = router;
