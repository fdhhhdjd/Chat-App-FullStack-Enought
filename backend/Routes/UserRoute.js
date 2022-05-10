const userCtrl = require("../Controllers/userController");
const router = require("express").Router();
//!User

//Register
router.post("/register", userCtrl.register);

//Login
router.post("/login", userCtrl.Login);

module.exports = router;
