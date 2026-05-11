const prisma = require("../lib/prisma")

const getMyAttendances = async (req, res, next) => {
    try{
    const attendances = await prisma.attendance.findMany( { 
        where: { userId: req.user.id},
        include: {event: true}
          })
    res.json(attendances)
    } catch (err) {
    next(err)
    }
}

const getMyEvents = async (req, res, next) => {
    try{
    const events = await prisma.event.findMany({ where: { organizerId: req.user.id } })
    res.json(events)
    } catch (err) {
    next(err)
    }
}


module.exports = {getMyAttendances, getMyEvents}