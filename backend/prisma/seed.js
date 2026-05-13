const prisma = require('../lib/prisma')
const bcrypt = require('bcryptjs')

async function main() {

  if (process.env.NODE_ENV === 'production') {
    console.log('Seed skipped in production')
    return
  }

  // ─── Passwords ───────────────────────────────────────────────────────────────
  const passwordAdmin = await bcrypt.hash('quedamos2026', 10)
  const passwordOrg   = await bcrypt.hash('org123', 10)
  const passwordUser  = await bcrypt.hash('user123', 10)

  // ─── Users ───────────────────────────────────────────────────────────────────
  await prisma.user.upsert({
    where:  { email: 'admin@quedamos.org' },
    update: { password: passwordAdmin },
    create: { name: 'Admin', email: 'admin@quedamos.org', password: passwordAdmin, role: 'ADMIN' }
  })

  // Organizers — associations
  await prisma.user.upsert({
    where:  { email: 'eventos@culturalironhack.ic' },
    update: { name: 'Asociación Cultural El Timple' },
    create: { name: 'Asociación Cultural El Timple', email: 'eventos@culturalironhack.ic', password: passwordOrg, role: 'ORGANIZER' }
  })
  await prisma.user.upsert({
    where:  { email: 'gestion-cultural@telde.ic' },
    update: { name: 'Asociación Canaria de Senderismo' },
    create: { name: 'Asociación Canaria de Senderismo', email: 'gestion-cultural@telde.ic', password: passwordOrg, role: 'ORGANIZER' }
  })
  await prisma.user.upsert({
    where:  { email: 'solidaria@canarias.ic' },
    update: {},
    create: { name: 'Asociación Solidaria Canarias', email: 'solidaria@canarias.ic', password: passwordOrg, role: 'ORGANIZER' }
  })

  // Organizers — commerce
  await prisma.user.upsert({
    where:  { email: 'cafe@laguagua.ic' },
    update: {},
    create: { name: 'Cafetería La Guagua', email: 'cafe@laguagua.ic', password: passwordOrg, role: 'ORGANIZER' }
  })

  // Organizers — individuals
  await prisma.user.upsert({
    where:  { email: 'laura@mendoza.ic' },
    update: {},
    create: { name: 'Laura Mendoza', email: 'laura@mendoza.ic', password: passwordOrg, role: 'ORGANIZER' }
  })
  await prisma.user.upsert({
    where:  { email: 'pedro@santana.ic' },
    update: {},
    create: { name: 'Pedro Santana', email: 'pedro@santana.ic', password: passwordOrg, role: 'ORGANIZER' }
  })
  await prisma.user.upsert({
    where:  { email: 'carmen@reyes.ic' },
    update: {},
    create: { name: 'Carmen Reyes', email: 'carmen@reyes.ic', password: passwordOrg, role: 'ORGANIZER' }
  })

  // Regular users
  await prisma.user.upsert({
    where:  { email: 'maria@example.ic' },
    update: {},
    create: { name: 'María García', email: 'maria@example.ic', password: passwordUser, role: 'USER' }
  })
  await prisma.user.upsert({
    where:  { email: 'carlos@example.ic' },
    update: {},
    create: { name: 'Carlos Pérez', email: 'carlos@example.ic', password: passwordUser, role: 'USER' }
  })
  await prisma.user.upsert({
    where:  { email: 'ana@example.ic' },
    update: {},
    create: { name: 'Ana Suárez', email: 'ana@example.ic', password: passwordUser, role: 'USER' }
  })
  await prisma.user.upsert({
    where:  { email: 'roberto@example.ic' },
    update: {},
    create: { name: 'Roberto Díaz', email: 'roberto@example.ic', password: passwordUser, role: 'USER' }
  })

  // ─── Categories ──────────────────────────────────────────────────────────────
  await prisma.category.upsert({
    where:  { slug: 'cultura' },
    update: { description: 'Arte, teatro, cine, literatura y expresión cultural de todo tipo.' },
    create: { name: 'Cultura', slug: 'cultura', description: 'Arte, teatro, cine, literatura y expresión cultural de todo tipo.' }
  })
  await prisma.category.upsert({
    where:  { slug: 'deporte' },
    update: { description: 'Actividades deportivas, torneos y movimiento para todos los niveles.' },
    create: { name: 'Deporte', slug: 'deporte', description: 'Actividades deportivas, torneos y movimiento para todos los niveles.' }
  })
  await prisma.category.upsert({
    where:  { slug: 'musica' },
    update: { description: 'Conciertos, actuaciones, talleres musicales y jam sessions.' },
    create: { name: 'Música', slug: 'musica', description: 'Conciertos, actuaciones, talleres musicales y jam sessions.' }
  })
  await prisma.category.upsert({
    where:  { slug: 'solidaridad' },
    update: { description: 'Acción comunitaria, ayuda mutua, voluntariado y recogidas.' },
    create: { name: 'Solidaridad', slug: 'solidaridad', description: 'Acción comunitaria, ayuda mutua, voluntariado y recogidas.' }
  })
  await prisma.category.upsert({
    where:  { slug: 'naturaleza' },
    update: { description: 'Senderismo, rutas, actividades al aire libre y medioambiente.' },
    create: { name: 'Naturaleza', slug: 'naturaleza', description: 'Senderismo, rutas, actividades al aire libre y medioambiente.' }
  })

  // ─── Special Tags ─────────────────────────────────────────────────────────────
  await prisma.tag.upsert({
    where:  { slug: 'dia-de-canarias' },
    update: {},
    create: { name: 'Día de Canarias', slug: 'dia-de-canarias' }
  })
  await prisma.tag.upsert({
    where:  { slug: 'benefico' },
    update: {},
    create: { name: 'Benéfico', slug: 'benefico' }
  })
  await prisma.tag.upsert({
    where:  { slug: 'familiar' },
    update: {},
    create: { name: 'Familiar', slug: 'familiar' }
  })

  // ─── Fetch references ─────────────────────────────────────────────────────────
  const timple     = await prisma.user.findUnique({ where: { email: 'eventos@culturalironhack.ic' } })
  const senderismo = await prisma.user.findUnique({ where: { email: 'gestion-cultural@telde.ic' } })
  const solidaria  = await prisma.user.findUnique({ where: { email: 'solidaria@canarias.ic' } })
  const guagua     = await prisma.user.findUnique({ where: { email: 'cafe@laguagua.ic' } })
  const laura      = await prisma.user.findUnique({ where: { email: 'laura@mendoza.ic' } })
  const pedro      = await prisma.user.findUnique({ where: { email: 'pedro@santana.ic' } })
  const carmen     = await prisma.user.findUnique({ where: { email: 'carmen@reyes.ic' } })

  const cultura     = await prisma.category.findUnique({ where: { slug: 'cultura' } })
  const deporte     = await prisma.category.findUnique({ where: { slug: 'deporte' } })
  const musica      = await prisma.category.findUnique({ where: { slug: 'musica' } })
  const solidaridad = await prisma.category.findUnique({ where: { slug: 'solidaridad' } })
  const naturaleza  = await prisma.category.findUnique({ where: { slug: 'naturaleza' } })

  // ─── Clear events & attendances ───────────────────────────────────────────────
  await prisma.attendance.deleteMany({})
  await prisma.event.deleteMany({})

  // ─── Events — asociaciones y comercios ───────────────────────────────────────

  await prisma.event.create({ data: {
    title: 'Jam session en La Guagua',
    description: 'Noche de improvisación musical abierta a personas de todos los estilos y niveles. Trae tu instrumento o simplemente ven a escuchar.',
    date: new Date('2026-05-13T21:00:00Z'),
    location: 'Cafetería La Guagua, C/ Perdomo 12',
    area: 'Centro',
    maxCapacity: null,
    imageUrl: 'https://picsum.photos/seed/jam-session/800/400',
    tags: ['free', 'indoor'],
    categoryId: musica.id,
    organizerId: guagua.id
  }})

  await prisma.event.create({ data: {
    title: 'Taller de escritura creativa',
    description: 'Aprende técnicas narrativas en un taller participativo. Exploraremos el relato corto, la memoria y la escritura automática. Para todas las edades y sin experiencia previa.',
    date: new Date('2026-05-14T17:00:00Z'),
    location: 'Centro Cultural Pérez Galdós, sala B',
    area: 'Centro',
    maxCapacity: 20,
    imageUrl: 'https://picsum.photos/seed/escritura/800/400',
    tags: ['free', 'indoor', 'beginner_friendly'],
    categoryId: cultura.id,
    organizerId: timple.id
  }})

  await prisma.event.create({ data: {
    title: 'Grupo de teatro comunitario — sesión abierta',
    description: 'Sesión de puertas abiertas del grupo de teatro comunitario. Ven a conocernos, participar en ejercicios de improvisación y decidir si quieres unirte al proyecto.',
    date: new Date('2026-05-14T19:00:00Z'),
    location: 'Sala de usos múltiples, Parroquia de San Telmo',
    area: 'Centro',
    maxCapacity: 20,
    imageUrl: 'https://picsum.photos/seed/teatro/800/400',
    tags: ['free', 'indoor', 'beginner_friendly', 'collaboration'],
    categoryId: cultura.id,
    organizerId: timple.id
  }})

  await prisma.event.create({ data: {
    title: 'Recogida de residuos en Las Canteras',
    description: 'Acción de limpieza de la playa más emblemática de Las Palmas. Se proporcionan guantes, bolsas y refrigerio al final. Ideal para venir en familia.',
    date: new Date('2026-05-16T09:00:00Z'),
    location: 'Playa de Las Canteras — entrada por el Auditorio Alfredo Kraus',
    area: 'Isleta-Puerto-Canteras',
    maxCapacity: 50,
    imageUrl: 'https://picsum.photos/seed/playa-limpieza/800/400',
    tags: ['free', 'outdoor', 'collaboration'],
    categoryId: solidaridad.id,
    organizerId: solidaria.id
  }})

  await prisma.event.create({ data: {
    title: 'Torneo de pádel mixto',
    description: 'Torneo de pádel en formato mixto. Se forman parejas aleatoriamente. Nivel intermedio recomendado. El precio de inscripción incluye el alquiler de pista.',
    date: new Date('2026-05-17T10:00:00Z'),
    location: 'Club de Pádel Siete Palmas',
    area: 'Ciudad Alta',
    maxCapacity: 32,
    imageUrl: 'https://picsum.photos/seed/padel/800/400',
    tags: ['paid', 'outdoor'],
    categoryId: deporte.id,
    organizerId: laura.id
  }})

  await prisma.event.create({ data: {
    title: 'Mercadillo de intercambio y segunda mano',
    description: 'Trae lo que ya no uses e intercámbialo con otras personas. Sin dinero, solo trueque. Libros, ropa, plantas, herramientas — todo vale.',
    date: new Date('2026-05-18T10:00:00Z'),
    location: 'Parque Santa Catalina',
    area: 'Isleta-Puerto-Canteras',
    maxCapacity: null,
    imageUrl: 'https://picsum.photos/seed/mercadillo/800/400',
    tags: ['free', 'outdoor'],
    categoryId: cultura.id,
    organizerId: timple.id
  }})

  await prisma.event.create({ data: {
    title: 'Exposición fotográfica: Gran Canaria invisible',
    description: 'Muestra colectiva de fotografía documental sobre rincones y comunidades poco visibles de la isla. Entrada libre. Visitas guiadas los fines de semana.',
    date: new Date('2026-05-19T11:00:00Z'),
    location: 'Espacio cultural CICCA',
    area: 'Vegueta-Cono Sur-Tafira',
    maxCapacity: null,
    imageUrl: 'https://picsum.photos/seed/fotografia/800/400',
    tags: ['free', 'indoor'],
    categoryId: cultura.id,
    organizerId: timple.id
  }})

  await prisma.event.create({ data: {
    title: 'Charla: la soledad no deseada en personas mayores',
    description: 'Espacio de reflexión y debate abierto sobre el aislamiento social en la tercera edad. Con personas del trabajo social y testimonios en primera persona.',
    date: new Date('2026-05-20T18:00:00Z'),
    location: 'Biblioteca Insular de Gran Canaria',
    area: 'Vegueta-Cono Sur-Tafira',
    maxCapacity: 40,
    imageUrl: 'https://picsum.photos/seed/charla-soledad/800/400',
    tags: ['free', 'indoor'],
    categoryId: solidaridad.id,
    organizerId: solidaria.id,
    specialTags: { connect: [{ slug: 'benefico' }] }
  }})

  await prisma.event.create({ data: {
    title: 'Cine al aire libre: ciclo de cine canario',
    description: 'Primera sesión del ciclo de cine canario contemporáneo. Se proyecta "Guarapo" (1988, Antonio José Betancor). Trae tu manta y tu silla de tijera.',
    date: new Date('2026-05-21T21:30:00Z'),
    location: 'Explanada del Castillo de la Luz',
    area: 'Isleta-Puerto-Canteras',
    maxCapacity: null,
    imageUrl: 'https://picsum.photos/seed/cine-aire-libre/800/400',
    tags: ['free', 'outdoor'],
    categoryId: cultura.id,
    organizerId: guagua.id
  }})

  await prisma.event.create({ data: {
    title: 'Carrera popular por el casco de Ingenio',
    description: 'Carrera popular de 5 km por el casco urbano de Ingenio. Apta para todos los niveles. Categorías por edades. Premio simbólico para las tres primeras personas clasificadas en cada categoría.',
    date: new Date('2026-05-22T20:00:00Z'),
    location: 'Plaza del Ayuntamiento de Ingenio',
    area: 'Ingenio',
    maxCapacity: 200,
    imageUrl: 'https://picsum.photos/seed/carrera-popular/800/400',
    tags: ['free', 'outdoor', 'beginner_friendly'],
    categoryId: deporte.id,
    organizerId: senderismo.id
  }})

  await prisma.event.create({ data: {
    title: 'Taller de reparación de bicicletas',
    description: 'Aprende a mantener y reparar tu bicicleta. Traeremos herramientas y habrá personas expertas en mecánica para ayudarte. Trae tu bici si quieres que te la revisen.',
    date: new Date('2026-05-23T10:00:00Z'),
    location: 'Paseo de Las Canteras, frente al kiosco central',
    area: 'Isleta-Puerto-Canteras',
    maxCapacity: 15,
    imageUrl: 'https://picsum.photos/seed/bicicleta/800/400',
    tags: ['free', 'outdoor', 'beginner_friendly', 'collaboration'],
    categoryId: deporte.id,
    organizerId: solidaria.id
  }})

  await prisma.event.create({ data: {
    title: 'Limpieza del cauce del Barranco de Tamaraceite',
    description: 'Jornada de acción ambiental para limpiar el cauce del barranco. Se proporcionan guantes, bolsas y merienda al terminar.',
    date: new Date('2026-05-23T09:00:00Z'),
    location: 'Entrada del barranco por la Calle Tamaraceite',
    area: 'Tamaraceite-San Lorenzo',
    maxCapacity: 30,
    imageUrl: 'https://picsum.photos/seed/barranco-limpieza/800/400',
    tags: ['free', 'outdoor', 'collaboration'],
    categoryId: naturaleza.id,
    organizerId: solidaria.id
  }})

  await prisma.event.create({ data: {
    title: 'Senderismo por el Barranco de Guayadeque',
    description: 'Ruta de dificultad media por uno de los barrancos más emblemáticos de Gran Canaria. Unos 8 km con parada en las cuevas. Nivel básico suficiente.',
    date: new Date('2026-05-24T08:00:00Z'),
    location: 'Aparcamiento entrada Barranco de Guayadeque',
    area: 'Agüimes',
    maxCapacity: 20,
    imageUrl: 'https://picsum.photos/seed/guayadeque/800/400',
    tags: ['free', 'outdoor', 'beginner_friendly'],
    categoryId: naturaleza.id,
    organizerId: senderismo.id
  }})

  await prisma.event.create({ data: {
    title: 'Recital de poesía canaria contemporánea',
    description: 'Noche de poesía con autoras y autores canarios actuales. Lectura de textos inéditos, diálogo con el público y música en vivo al fondo.',
    date: new Date('2026-05-30T19:00:00Z'),
    location: 'Biblioteca Municipal de Telde',
    area: 'Telde',
    maxCapacity: 50,
    imageUrl: 'https://picsum.photos/seed/poesia/800/400',
    tags: ['free', 'indoor'],
    categoryId: cultura.id,
    organizerId: timple.id,
    specialTags: { connect: [{ slug: 'dia-de-canarias' }] }
  }})

  await prisma.event.create({ data: {
    title: 'Concierto de bandas canarias en la Plaza de San Juan',
    description: 'Gran concierto al aire libre con cuatro bandas locales de distintos estilos: folclore, jazz fusión, indie y timple contemporáneo. Entrada libre.',
    date: new Date('2026-05-30T20:00:00Z'),
    location: 'Plaza de San Juan, Telde',
    area: 'Telde',
    maxCapacity: null,
    imageUrl: 'https://picsum.photos/seed/concierto-canario/800/400',
    tags: ['free', 'outdoor'],
    categoryId: musica.id,
    organizerId: timple.id,
    specialTags: { connect: [{ slug: 'dia-de-canarias' }] }
  }})

  await prisma.event.create({ data: {
    title: 'Baile de folclore canario — sesión para principiantes',
    description: 'Aprende los pasos básicos del baile folclórico canario. La asociación abrirá sus ensayos al público para esta sesión especial del Día de Canarias.',
    date: new Date('2026-05-30T17:00:00Z'),
    location: 'Casa de la Cultura de Vegueta',
    area: 'Vegueta-Cono Sur-Tafira',
    maxCapacity: 30,
    imageUrl: 'https://picsum.photos/seed/folklore-canario/800/400',
    tags: ['free', 'indoor', 'beginner_friendly'],
    categoryId: cultura.id,
    organizerId: timple.id,
    specialTags: { connect: [{ slug: 'dia-de-canarias' }] }
  }})

  await prisma.event.create({ data: {
    title: 'Feria de artesanía canaria de Teror',
    description: 'Feria de artesanía local con más de 30 expositores: cerámica, bordados, cestería, dulces típicos y productos del campo. Entrada libre para toda la familia.',
    date: new Date('2026-05-30T10:00:00Z'),
    location: 'Alrededores de la Basílica de Teror',
    area: 'Teror',
    maxCapacity: null,
    imageUrl: 'https://picsum.photos/seed/artesania-teror/800/400',
    tags: ['free', 'outdoor'],
    categoryId: cultura.id,
    organizerId: laura.id,
    specialTags: { connect: [{ slug: 'dia-de-canarias' }, { slug: 'familiar' }] }
  }})

  await prisma.event.create({ data: {
    title: 'Ruta al Roque Nublo',
    description: 'Ruta de montaña hacia el símbolo natural de Gran Canaria. Salida desde el aparcamiento de La Goleta. Dificultad baja-media, unos 6 km de recorrido total.',
    date: new Date('2026-06-07T08:00:00Z'),
    location: 'Aparcamiento La Goleta, Tejeda',
    area: 'Tejeda',
    maxCapacity: 25,
    imageUrl: 'https://picsum.photos/seed/roque-nublo/800/400',
    tags: ['free', 'outdoor'],
    categoryId: naturaleza.id,
    organizerId: senderismo.id
  }})

  await prisma.event.create({ data: {
    title: 'Taller de iniciación a la huerta urbana',
    description: 'Aprende los fundamentos del cultivo en balcón y espacios pequeños. Cada persona participante se lleva una maceta preparada para casa.',
    date: new Date('2026-06-06T10:00:00Z'),
    location: 'Centro Cívico Ciudad Alta',
    area: 'Ciudad Alta',
    maxCapacity: 15,
    imageUrl: 'https://picsum.photos/seed/huerta-urbana/800/400',
    tags: ['free', 'indoor', 'beginner_friendly'],
    categoryId: naturaleza.id,
    organizerId: laura.id
  }})

  await prisma.event.create({ data: {
    title: 'Concierto benéfico de jazz',
    description: 'Concierto de jazz a cargo del cuarteto Atlántico Jazz. Precio de entrada con donativo mínimo. La recaudación íntegra se destina al comedor social del barrio.',
    date: new Date('2026-06-13T20:00:00Z'),
    location: 'Sala El Cine, C/ León y Castillo 11',
    area: 'Centro',
    maxCapacity: 80,
    imageUrl: 'https://picsum.photos/seed/concierto-jazz/800/400',
    tags: ['paid', 'indoor'],
    categoryId: musica.id,
    organizerId: guagua.id,
    specialTags: { connect: [{ slug: 'benefico' }] }
  }})

  // ─── Events — buscar grupo (actividades informales de personas individuales) ──

  await prisma.event.create({ data: {
    title: 'Busco dos personas para equipo de baloncesto 3x3',
    description: 'Me apunto a un torneo de baloncesto 3x3 el próximo mes y necesito completar equipo. Busco dos personas con ganas de pasarlo bien, no hace falta nivel alto. Entrenamos un par de veces antes.',
    date: new Date('2026-05-28T18:00:00Z'),
    location: 'Pistas de baloncesto del Parque del Estadio',
    area: 'Ciudad Alta',
    maxCapacity: 2,
    imageUrl: 'https://picsum.photos/seed/baloncesto/800/400',
    tags: ['free', 'outdoor', 'beginner_friendly', 'collaboration'],
    categoryId: deporte.id,
    organizerId: pedro.id
  }})

  await prisma.event.create({ data: {
    title: 'Caminata matutina diaria por la orilla del mar',
    description: 'Salgo a caminar cada mañana de lunes a viernes de 7:30 a 8:30 por el paseo de Las Canteras. Si quieres compañía para hacer el hábito más llevadero, apúntate. Sin compromiso de asistencia diaria.',
    date: new Date('2026-05-14T07:30:00Z'),
    location: 'Paseo de Las Canteras, kiosco frente a la Punta',
    area: 'Isleta-Puerto-Canteras',
    maxCapacity: 8,
    imageUrl: 'https://picsum.photos/seed/caminata-mar/800/400',
    tags: ['free', 'outdoor', 'beginner_friendly', 'collaboration'],
    categoryId: deporte.id,
    organizerId: carmen.id
  }})

  await prisma.event.create({ data: {
    title: 'Grupo de lectura mensual — primera sesión',
    description: 'Quiero montar un grupo de lectura que se reúna una vez al mes en casa o en una cafetería. El primer libro lo elegimos entre todas las personas que se apunten. Máximo 6 personas para que la conversación sea cómoda.',
    date: new Date('2026-06-01T18:00:00Z'),
    location: 'Por determinar entre las personas participantes',
    area: 'Centro',
    maxCapacity: 6,
    imageUrl: 'https://picsum.photos/seed/grupo-lectura/800/400',
    tags: ['free', 'indoor', 'collaboration'],
    categoryId: cultura.id,
    organizerId: pedro.id
  }})

  await prisma.event.create({ data: {
    title: 'Busco personas para jugar al pádel los domingos',
    description: 'Juego al pádel los domingos por la mañana y quiero conocer personas con quien rotar. Nivel intermedio. Nos repartimos el coste de la pista entre todas las personas que vengan.',
    date: new Date('2026-05-18T10:00:00Z'),
    location: 'Club de Pádel Mesa y López',
    area: 'Centro',
    maxCapacity: 3,
    imageUrl: 'https://picsum.photos/seed/padel-domingos/800/400',
    tags: ['paid', 'outdoor', 'collaboration'],
    categoryId: deporte.id,
    organizerId: carmen.id
  }})

  await prisma.event.create({ data: {
    title: 'Equipo de voleibol playa — busco personas para completar',
    description: 'Tengo cuatro personas para voleibol playa y necesito dos más para poder jugar partidos completos. Quedamos los sábados por la tarde en Las Canteras. Sin nivel exigido, solo ganas.',
    date: new Date('2026-05-16T17:00:00Z'),
    location: 'Playa de Las Canteras, zona de redes',
    area: 'Isleta-Puerto-Canteras',
    maxCapacity: 2,
    imageUrl: 'https://picsum.photos/seed/voleibol-playa/800/400',
    tags: ['free', 'outdoor', 'beginner_friendly', 'collaboration'],
    categoryId: deporte.id,
    organizerId: pedro.id
  }})

  console.log('Seed completado: 12 usuarios, 5 categorías, 3 tags especiales, 25 eventos (20 de entidades + 5 de buscar grupo).')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
