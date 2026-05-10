const prisma = require("../lib/prisma")

const getCategories = async (req, res, next) => {
    try{
  const categories = await prisma.category.findMany()
  res.json(categories)
} catch (err) {
    next(err)
    }
}

module.exports = {getCategories}