const express = require("express")
const { register, login } = require("../controllers/auth.controller")
const { loginSchema, registerSchema } = require("../schemas/auth.schema")
const   validate = require("../middleware/validate")
const   authLimiter = require("../middleware/rateLimit")

const router = express.Router()

router.post("/register", authLimiter, validate(registerSchema), register)
router.post("/login", authLimiter, validate(loginSchema), login)

module.exports = router