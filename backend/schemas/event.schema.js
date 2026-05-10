const { z } = require('zod')

const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.coerce.date(),
  location: z.string().min(3),
  area: z.string().min(3),
  maxCapacity: z.number().int().positive(),
  categoryId: z.number().int().positive()
})

const updateEventSchema = createEventSchema.partial()

module.exports = { createEventSchema, updateEventSchema }
