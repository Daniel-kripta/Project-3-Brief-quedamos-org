const express = require('express')
const {verifyToken, requireRole} = require("../middleware/auth")
const validate = require("../middleware/validate")
const {createEventSchema, updateEventSchema} = require("../schemas/event.schema")
const {createEvent, updateEvent, deleteEvent, getEvent, getEvents, attendEvent, cancelAttendance, getAreas, checkAttendance} = require("../controllers/events.controller")

const router = express.Router()

router.get("/", getEvents)
router.get("/areas", getAreas)
router.get("/:id/attend", verifyToken, checkAttendance)
router.get("/:id", getEvent)

router.post("/", verifyToken, requireRole("ADMIN", "ORGANIZER"), createEvent)
router.post("/:id/attend", verifyToken, attendEvent)

router.put("/:id", verifyToken, validate(updateEventSchema), updateEvent)

router.delete("/:id", verifyToken, deleteEvent)
router.delete("/:id/attend", verifyToken, cancelAttendance)


module.exports = router
