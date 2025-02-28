const RegisterRoutes = require('./register');
const LoginRoutes = require('./login');
const UpdateRoutes = require('./user_update');
const express = require('express');
const router = express.Router();

router.use("/register", RegisterRoutes);
router.use("/login", LoginRoutes);
router.use("/user", UpdateRoutes);

module.exports = router;