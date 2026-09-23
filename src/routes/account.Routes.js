
const express = require("express");
const {createAccount, getAllAccount, getAccountBalance } = require("../Controller/account.Controller.js")
const { authMiddleware } = require("../middleware/auth.Middleware.js")



const router = express.Router();
router.post("/create", authMiddleware, createAccount);

router.get('/allAccount', authMiddleware, getAllAccount);

router.get("/balance/:accountId", authMiddleware, getAccountBalance)



module.exports = router