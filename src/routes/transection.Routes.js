const express = require('express');
const { authMiddleware, systemUserMiddleware} = require("../middleware/auth.Middleware");

const { createTransetion, createInitalTransetion } = require('../Controller/transection.Controller.js')

const router = express.Router();



router.post('/creatTransetion', authMiddleware, createTransetion);

router.post('/creatTransetion-system',authMiddleware, createInitalTransetion);

module.exports = router;