require('dotenv').config()
const express = require('express')
const cors = require('cors')

const authRouter = require("./routes/auth.routes")
const eventsRouter = require("./routes/events.routes")
const categoriesRouter = require("./routes/categories.routes")
const userRouter = require("./routes/user.routes")
const adminRouter = require("./routes/admin.routes")

const errorHandler = require("./middleware/errorHandler")

const app = express()

app.set('trust proxy', 1) // Railway sits behind a proxy; needed for rate-limit to read the real client IP
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/events", eventsRouter)
app.use("/api/categories", categoriesRouter)
app.use("/api/users", userRouter)
app.use("/api/admin", adminRouter)

app.get('/', (req, res) => {
  res.json({ message: 'quedamos.org API' })
})

app.use(errorHandler)

module.exports = app
