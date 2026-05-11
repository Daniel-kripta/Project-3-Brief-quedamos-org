const prisma = require("../lib/prisma")

const getAllUsers = async (req, res, next) => {
      
    try{
        const users = await prisma.user.findMany({

            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        })
    
    res.json(users)

    } catch (err) {
        next(err)
    }

}

const getAllEvents = async (req, res, next) => {
    try{
        const events = await prisma.event.findMany({
            include:{
                category: true,
                _count: {select: {attendances: true}}
            }
        })
    
    res.json(events)

    } catch (err) {
        next(err)
    }
    
}

const deleteUser = async (req, res, next) => {
    const {id} = req.params
    try{
        const user = await prisma.user.findUnique({
            where: { id: Number(id)},
            include: {
                events: true,
                attendances: true}
        })

        if (!user) return res.status(404).json({error: "User not found"})

        if (user.role === "ADMIN") {
            return res.status(403).json({ error: "Cannot delete an admin"})
        }

        await prisma.attendance.deleteMany({ where: { userId: Number(id)}})
        await prisma.attendance.deleteMany({ where: { event: { organizerId: Number(id)}}})
        await prisma.event.deleteMany({ where: { organizerId: Number(id)}})
        await prisma.user.delete({ where: {id: Number(id)}})
    res.json({ message: "User deleted"})
    } catch (err) {
        next(err)
    }
    
}

module.exports = {getAllUsers, getAllEvents, deleteUser}
