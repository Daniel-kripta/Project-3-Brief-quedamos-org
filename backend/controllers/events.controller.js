const prisma = require("../lib/prisma")
const nodemailer = require('nodemailer')


const getEvents = async (req, res, next) => {
    const {area, categoryId, from, to} = req.query
    const where = {}
    if (area) where.area = area
    if (categoryId) where.categoryId = Number(categoryId)
    where.date = {
        gte: from ? new Date(from) : new Date(),
        ...(to && {lte: new Date(to)})
    }

    try{
        const events = await prisma.event.findMany({
            where,
            orderBy: {date: "asc"},
            include: {
                category: true,
                specialTags: true,
                _count: {select: {attendances: true}}
            }
        })
        const visible = events.filter(e =>
            e.maxCapacity === null || e._count.attendances < e.maxCapacity
        )
        res.json(visible)
    }   catch (err) {
        next(err)
    }
}

const getEvent = async (req, res, next) => {
    
    try{
        const event = await prisma.event.findUnique({
            where: {id: req.id},
            include: {
                category: true,
                specialTags: true,
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
    const {title, description, date, location, area, maxCapacity, minCapacity, imageUrl, categoryId, tags, specialTagIds, registrationOpensAt, registrationClosesAt} = req.body
    
    try{
    const organizerId = req.user.id
    const event = await prisma.event.create({
        data: {
            title,
            description,
            date,
            location,
            area,
            maxCapacity,
            minCapacity,
            imageUrl,
            categoryId,
            tags,
            specialTags: { connect: (specialTagIds || []).map(id => ({ id })) },
            organizerId,
            registrationClosesAt,
            registrationOpensAt
        },
        include: {
            category: true,
            specialTags: true,
            organizer: { select: { name: true } }
    }

    })
    res.status(201).json(event)
}   catch (err) {
    next(err)
}
}

const updateEvent = async (req, res, next) => {
    
    const {title, description, date, location, area, maxCapacity, minCapacity, imageUrl, categoryId, tags, specialTagIds, registrationOpensAt, registrationClosesAt} = req.body

    try{
        const event = await prisma.event.findUnique({
            where: {id: req.id},
            

        })
        if (!event) return res.status(404).json({error: "Unfound event"})
        if (event.organizerId !== req.user.id && req.user.role !== "ADMIN") return res.status(403).json({error: "Forbidden"})
    

    const updated = await prisma.event.update({
        where: {id: req.id},
        data: {
            title,
            description,
            date,
            location,
            area,
            maxCapacity,
            minCapacity,
            imageUrl,
            categoryId,
            tags, // TODO: si se elimina un valor de VALID_TAGS (lib/tag.js), los eventos con ese tag fallarán al actualizar
            specialTags: { set: (specialTagIds || []).map(id => ({ id })) },
            registrationClosesAt,
            registrationOpensAt
        }
    })
    res.json(updated)
    }    catch (err) {
        next(err)
    }
    
}

const deleteEvent = async (req, res, next) => {
    
    try {
        const event = await prisma.event.findUnique({ where: { id: req.id } })

        if (!event) return res.status(404).json({ error: 'Event not found' })

        if (event.organizerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Forbidden' })
        }

        // se borran las asistencias antes que el evento para evitar referencias huérfanas en la BD
        await prisma.attendance.deleteMany({ where: { eventId: req.id } })
        await prisma.event.delete({ where: { id: req.id } })

        res.json({ message: 'Event deleted' })
    } catch (err) {
        next(err)
    }
}

const attendEvent = async (req, res, next) => {

    try {
    const event = await prisma.event.findUnique({ 
        where: { id: req.id }, 
        include: {_count: {select: {attendances: true}}}  })

    if (!event) return res.status(404).json({ error: 'Event not found' })
    if (event.maxCapacity !== null && event._count.attendances >= event.maxCapacity) return res.status(400).json({ error: 'Event is full' })
    

    await prisma.attendance.create({ data: { userId: req.user.id, eventId: req.id } })

    // nodemailer — sin await para que el email no retrase la respuesta al cliente
    if (process.env.EMAIL_USER) {  
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    })

    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: req.user.email,
        subject: `Confirmación de asistencia — ${event.title}`,
        text: `Hola ${req.user.name}, tu asistencia al evento "${event.title}" el ${event.date.toLocaleDateString('es-ES')} ha sido confirmada.`
    }).catch(err => console.error('Email failed:', err.message))
}


    res.status(201).json({ message: 'Attendance confirmed' })
} catch (err) {
    next(err)
}


}

const cancelAttendance = async (req, res, next) => {

    try{
    await prisma.attendance.delete({
    where: { userId_eventId: { userId: req.user.id, eventId: req.id } }
})
    res.json({message: "Attendance cancelled"})
    } catch (err) {
        next(err)
    }

}

const getAreas = async (req, res, next) => {
    try {
        const areas = await prisma.event.findMany({
            select: { area: true },
            distinct: ['area'],
            orderBy: { area: 'asc' }
        })
        res.json(areas.map(e => e.area))
    } catch (err) {
        next(err)
    }
}

const checkAttendance = async (req, res, next) => {
    
    try {
        const attendance = await prisma.attendance.findUnique({
            where: { userId_eventId: { userId: req.user.id, eventId: req.id } }
        })
        res.json({ attending: !!attendance })
    } catch (err) {
        next(err)
    }
}



module.exports = {getEvents, getEvent, createEvent, updateEvent, deleteEvent, attendEvent, cancelAttendance, getAreas, checkAttendance}