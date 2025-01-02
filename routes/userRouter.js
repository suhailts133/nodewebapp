const express = require("express");
const userController = require("../controllers/user/userController.js");
const router = express.Router();

router.get("/pageNotFound", userController.pageNotFound);
router.get("/", userController.loadHomePage)



module.exports = router;