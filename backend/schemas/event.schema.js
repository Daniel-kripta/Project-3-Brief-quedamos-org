const { z } = require('zod')
const VALID_TAGS = require('../lib/tags')

const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.coerce.date(),
  location: z.string().min(3),
  area: z.string().min(3),
  maxCapacity: z.number().int().positive().optional().nullable(),
  minCapacity: z.number().int().positive().optional().nullable(),
  imageUrl: z.string().url().optional(),
  categoryId: z.number().int().positive(),
  specialTagIds: z.array(z.number().int().positive()).optional(),
  tags: z.array(z.enum(VALID_TAGS)).default([]),
  registrationOpensAt: z.coerce.date().optional(),
  registrationClosesAt: z.coerce.date().optional().refine(
  date => !date || date > new Date(),
  { message: 'Registration close date must be in the future' }
)
})

const updateEventSchema = createEventSchema.partial()

module.exports = { createEventSchema, updateEventSchema }