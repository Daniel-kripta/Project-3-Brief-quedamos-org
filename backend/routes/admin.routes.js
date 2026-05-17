const express = require("express")
const {getAllUsers, getAllEvents, deleteUser} = require("../controllers/admin.controller")
const { verifyToken, requireRole } = require("../middleware/auth")
const validateId = require("../middleware/validateId")

const router = express.Router()

router.get("/users", verifyToken, requireRole("ADMIN"), getAllUsers)
router.get("/events", verifyToken, requireRole("ADMIN"), getAllEvents)
router.delete("/users/:id", validateId, verifyToken, requireRole("ADMIN"), deleteUser)

module.exports = router