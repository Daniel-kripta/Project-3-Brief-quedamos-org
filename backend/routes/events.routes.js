const express = require('express')
const {verifyToken, requireRole} = require("../middleware/auth")
const validate = require("../middleware/validate")
const {createEventSchema, updateEventSchema} = require("../schemas/event.schema")
const {createEvent, updateEvent, deleteEvent, getEvent, getEvents, attendEvent, cancelAttendance, getAreas, checkAttendance} = require("../controllers/events.controller")
const validateId = require('../middleware/validateId')

const router = express.Router()

router.get("/", getEvents)
router.get("/areas", getAreas)
router.get("/:id/attend", validateId, verifyToken, checkAttendance)
router.get("/:id", validateId, getEvent)

router.post("/", verifyToken, requireRole("ADMIN", "ORGANIZER"), validate(createEventSchema), createEvent)
router.post("/:id/attend", validateId, verifyToken, attendEvent)

router.put("/:id", validateId, verifyToken, validate(updateEventSchema), updateEvent)

router.delete("/:id", validateId, verifyToken, deleteEvent)
router.delete("/:id/attend", validateId, verifyToken, cancelAttendance)


module.exports = router