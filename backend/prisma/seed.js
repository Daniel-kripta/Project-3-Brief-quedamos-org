const prisma = require('../lib/prisma')
const bcrypt = require('bcryptjs')

async function main() {

if (process.env.NODE_ENV === 'production') {
    console.log('Seed skipped in production')
    return
  }

const passwordAdmin = await bcrypt.hash('admin123', 10)
const passwordOrg = await bcrypt.hash('org123', 10)
const passwordUser = await bcrypt.hash('user123', 10)

await prisma.user.upsert({
  where: { email: 'admin@quedamos.org' },
  update: {},
  create: { name: 'Admin', email: 'admin@quedamos.org', password: passwordAdmin, role: 'ADMIN' }
})

await prisma.user.upsert({
  where: { email: 'eventos@culturalironhack.ic' },
  update: {},
  create: { name: 'Asociación Cultural Ironhack', email: 'eventos@culturalironhack.ic', password: passwordOrg, role: 'ORGANIZER' }
})

await prisma.user.upsert({
  where: { email: 'gestion-cultural@telde.ic' },
  update: {},
  create: { name: 'Casa de la Cultura de Telde', email: 'gestion-cultural@telde.ic', password: passwordOrg, role: 'ORGANIZER' }
})

await prisma.user.upsert({
  where: { email: 'maria@example.ic' },
  update: {},
  create: { name: 'María García', email: 'maria@example.ic', password: passwordUser, role: 'USER' }
})

await prisma.user.upsert({
  where: { email: 'carlos@example.ic' },
  update: {},
  create: { name: 'Carlos Pérez', email: 'carlos@example.ic', password: passwordUser, role: 'USER' }
})

await prisma.category.upsert({
  where: { slug: 'cultura' },
  update: {},
  create: { name: 'Cultura', slug: 'cultura' }
})

await prisma.category.upsert({
  where: { slug: 'deporte' },
  update: {},
  create: { name: 'Deporte', slug: 'deporte' }
})

await prisma.category.upsert({
  where: { slug: 'musica' },
  update: {},
  create: { name: 'Música', slug: 'musica' }
})

await prisma.category.upsert({
  where: { slug: 'solidaridad' },
  update: {},
  create: { name: 'Solidaridad', slug: 'solidaridad' }
})

await prisma.category.upsert({
  where: { slug: 'naturaleza' },
  update: {},
  create: { name: 'Naturaleza', slug: 'naturaleza' }
})


const organizer1 = await prisma.user.findUnique({ where: { email: 'eventos@culturalironhack.ic' } })
const organizer2 = await prisma.user.findUnique({ where: { email: 'gestion-cultural@telde.ic' } })

const cultura = await prisma.category.findUnique({ where: { slug: 'cultura' } })
const deporte = await prisma.category.findUnique({ where: { slug: 'deporte' } })
const musica = await prisma.category.findUnique({ where: { slug: 'musica' } })
const solidaridad = await prisma.category.findUnique({ where: { slug: 'solidaridad' } })
const naturaleza = await prisma.category.findUnique({ where: { slug: 'naturaleza' } })


await prisma.attendance.deleteMany({})
await prisma.event.deleteMany({})

await prisma.event.createMany({
  data: [
    {
      title: 'Taller de escritura creativa',
      description: 'Aprende técnicas narrativas en un taller participativo para todas las edades.',
      date: new Date('2026-06-10T17:00:00.000Z'),
      location: 'Biblioteca Pública del Estado',
      area: 'Centro',
      maxCapacity: 20,
      categoryId: cultura.id,
      organizerId: organizer1.id
    },
    {
      title: 'Ruta senderista por el Barranco de Guayadeque',
      description: 'Ruta de dificultad media por uno de los barrancos más emblemáticos de Gran Canaria.',
      date: new Date('2026-06-14T08:00:00.000Z'),
      location: 'Entrada del Barranco de Guayadeque',
      area: 'Agüimes',
      maxCapacity: 30,
      categoryId: naturaleza.id,
      organizerId: organizer1.id
    },
    {
      title: 'Concierto de música tradicional canaria',
      description: 'Noche de folclore canario con agrupaciones locales en el casco histórico de Telde.',
      date: new Date('2026-06-20T20:00:00.000Z'),
      location: 'Plaza de San Juan',
      area: 'Telde',
      maxCapacity: 100,
      categoryId: musica.id,
      organizerId: organizer2.id
    },
    {
      title: 'Torneo de ajedrez por equipos',
      description: 'Torneo abierto a todos los niveles. Se forman equipos de 4 personas en el momento.',
      date: new Date('2026-06-21T10:00:00.000Z'),
      location: 'Centro Cívico Tamaraceite',
      area: 'Tamaraceite-San Lorenzo',
      maxCapacity: 40,
      categoryId: deporte.id,
      organizerId: organizer1.id
    },
    {
      title: 'Recogida de residuos en la playa de Las Canteras',
      description: 'Acción solidaria de limpieza de playa. Se proporcionan guantes y bolsas.',
      date: new Date('2026-06-28T09:00:00.000Z'),
      location: 'Playa de Las Canteras — frente al Auditorio',
      area: 'Puerto-Canteras',
      maxCapacity: 50,
      categoryId: solidaridad.id,
      organizerId: organizer2.id
    },
    {
      title: 'Mercadillo de trueque y segunda mano',
      description: 'Trae lo que ya no uses e intercámbialo. Sin dinero, solo intercambio.',
      date: new Date('2026-07-05T10:00:00.000Z'),
      location: 'Parque Santa Catalina',
      area: 'Puerto-Canteras',
      maxCapacity: 60,
      categoryId: cultura.id,
      organizerId: organizer2.id
    }
  ]
})


}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
