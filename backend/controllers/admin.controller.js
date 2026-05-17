const prisma = require("../lib/prisma")

const getAllUsers = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    try{
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                select: { id: true, name: true, email: true, role: true, createdAt: true }
            }),
            prisma.user.count()
        ])

        res.json({ data: users, total, page, totalPages: Math.ceil(total / limit) || 1 })

    } catch (err) {
        next(err)
    }
}

const getAllEvents = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    try{
        const [events, total] = await Promise.all([
            prisma.event.findMany({
                skip,
                take: limit,
                include: { category: true, _count: { select: { attendances: true } } }
            }),
            prisma.event.count()
        ])

        res.json({ data: events, total, page, totalPages: Math.ceil(total / limit) || 1 })

    } catch (err) {
        next(err)
    }
}

const deleteUser = async (req, res, next) => {
    
    try{
        const user = await prisma.user.findUnique({
            where: { id: req.id},
            include: {
                events: true,
                attendances: true}
        })

        if (!user) return res.status(404).json({error: "User not found"})

        if (user.role === "ADMIN") {
            return res.status(403).json({ error: "Cannot delete an admin"})
        }

        await prisma.attendance.deleteMany({ where: { userId: req.id}})
        await prisma.attendance.deleteMany({ where: { event: { organizerId: req.id}}})
        await prisma.event.deleteMany({ where: { organizerId: req.id}})
        await prisma.user.delete({ where: {id: req.id}})
    res.json({ message: "User deleted"})
    } catch (err) {
        next(err)
    }
    
}

module.exports = {getAllUsers, getAllEvents, deleteUser}
