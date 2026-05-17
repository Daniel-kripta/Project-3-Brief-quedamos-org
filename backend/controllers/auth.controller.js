const prisma = require("../lib/prisma")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = async (req, res, next) => {
    try {
        const {name, email, password, role} = req.body
        const passHashed = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {email, password: passHashed, name, role},
            select: { id: true, email: true, name: true, role: true},
        })

        const token = jwt.sign(
            {id: user.id, name: user.name, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )

        res.status(201).json({user, token})
        }   catch (err) {
            next (err)
        }

}

const login = async (req, res, next) => {
    try{
        const {email, password} = req.body
        const user = await prisma.user.findUnique({where: {email}})
        if (!user) return res.status(401).json({error: "Invalid credentials"})

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return res.status(401).json({error: "Invalid credentials"})
        
        const token = jwt.sign(
            {id: user.id, name: user.name, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )

        const {password: _, ...userData} = user
        res.json({user: userData, token})
    }   catch (err) {
        next(err)
    }
}

module.exports = {register, login}