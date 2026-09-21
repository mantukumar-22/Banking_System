
const express = require("express");
const {createAccount} = require("../Controller/account.Controller.js")
const { authMiddleware } = require("../middleware/auth.Middleware.js")



const router = express.Router();
router.post("/create", authMiddleware, createAccount);



module.exports = router