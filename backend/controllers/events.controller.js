const prisma = require("../lib/prisma")

const getEvents = async (req, res, next) => {
    const {area, categoryId, from} = req.query
    const where = {}
    if (area) where.area = area
    if (categoryId) where.categoryId = Number(categoryId)
    if (from) where.date = {gte: new Date(from)}

    try{
        const events = await prisma.event.findMany({
            where,
            include: {
                category: true,
                _count: {select: {attendances: true}}
            }
        })
        res.json(events)
    }   catch (err) {
        next(err)
    }
}

const getEvent = async (req, res, next) => {
    const {id} = req.params
    try{
        const event = await prisma.event.findUnique({
            where: {id: Number(id)},
            include: {
                category: true,
                organizer: {select: {name: true}},
                _count: {select: {attendances: true}}
            }
        })
        if (!event) return res.status(404).json({error: "Unfound event"})
        res.json(event)
        
    }
        catch (err) {
        next(err)
    }
    
}

const createEvent = async (req, res, next) => {
    const {title, description, date, location, area, maxCapacity, imageUrl, categoryId} = req.body
    
    try{
    const organizerId = req.user.id
    const event = await prisma.event.create({
        data: { title, description, date, location, area, maxCapacity, imageUrl, categoryId, organizerId }
    })
    res.status(201).json(event)
}   catch (err) {
    next(err)
}
}

const updateEvent = async (req, res, next) => {
    const {id} = req.params
    const {title, description, date, location, area, maxCapacity, imageUrl, categoryId} = req.body

    try{
        const event = await prisma.event.findUnique({
            where: {id: Number(id)},
            

        })
        if (!event) return res.status(404).json({error: "Unfound event"})
        if (event.organizerId !== req.user.id && req.user.role !== "ADMIN") return res.status(403).json({error: "Forbidden"})
    

    const updated = await prisma.event.update({
        where: {id: Number(id)},
        data: {title, description, date, location, area, maxCapacity, imageUrl, categoryId}
    })
    res.json(updated)
    }    catch (err) {
        next(err)
    }
    
}

const deleteEvent = async (req, res, next) => {
    const { id } = req.params

    try {
        const event = await prisma.event.findUnique({ where: { id: Number(id) } })

        if (!event) return res.status(404).json({ error: 'Event not found' })

        if (event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Forbidden' })
        }

        await prisma.attendance.deleteMany({ where: { eventId: Number(id) } })
        await prisma.event.delete({ where: { id: Number(id) } })

        res.json({ message: 'Event deleted' })
    } catch (err) {
        next(err)
    }
}

const attendEvent = async (req, res, next) => {

    const { id } = req.params

    try {
    const event = await prisma.event.findUnique({ 
        where: { id: Number(id) }, 
        include: {_count: {select: {attendances: true}}}  })

    if (!event) return res.status(404).json({ error: 'Event not found' })
    if (event._count.attendances >= event.maxCapacity) return res.status(400).json({ error: 'Event is full' })
    

    await prisma.attendance.create({ data: { userId: req.user.id, eventId: Number(id) } })

    res.status(201).json({ message: 'Attendance confirmed' })
} catch (err) {
    next(err)
}


}

const cancelAttendance = async (req, res, next) => {

    const { id } = req.params

    try{
    await prisma.attendance.delete({
    where: { userId_eventId: { userId: req.user.id, eventId: Number(id) } }
})
    res.json({message: "Attendance cancelled"})
    } catch (err) {
        next(err)
    }




}

module.exports = {getEvents, getEvent, createEvent, updateEvent, deleteEvent, attendEvent, cancelAttendance}