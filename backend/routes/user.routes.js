const express = require('express')

const { getMyAttendances, getMyEvents } = require("../controllers/user.controller")
const { verifyToken } = require('../middleware/auth')

const router = express.Router()

router.get("/me/attendances", verifyToken, getMyAttendances)
router.get("/me/events", verifyToken, getMyEvents)

module.exports = router