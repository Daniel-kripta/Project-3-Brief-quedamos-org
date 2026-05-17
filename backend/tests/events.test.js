const request = require('supertest')
const app = require('../app')
const prisma = require('../lib/prisma')
const bcrypt = require('bcryptjs')

let organizerToken
let userToken
let adminToken
let eventId
let adminUserId
let deleteTargetId

beforeAll(async () => {
  await prisma.attendance.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.user.deleteMany({})

  const password = await bcrypt.hash('password123', 10)

  await prisma.user.create({
    data: { name: 'Test Organizer', email: 'organizer@test.ic', password, role: 'ORGANIZER' }
  })

  await prisma.user.create({
    data: { name: 'Test User', email: 'user@test.ic', password, role: 'USER' }
  })

  const deleteTarget = await prisma.user.create({
    data: { name: 'Delete Target', email: 'delete@test.ic', password, role: 'USER' }
  })
  deleteTargetId = deleteTarget.id

  const admin = await prisma.user.create({
    data: { name: 'Test Admin', email: 'admin@test.ic', password, role: 'ADMIN' }
  })
  adminUserId = admin.id

  await prisma.category.upsert({
    where: { slug: 'test' },
    update: {},
    create: { name: 'Test', slug: 'test' }
  })

  const orgLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'organizer@test.ic', password: 'password123' })
  organizerToken = orgLogin.body.token

  const userLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@test.ic', password: 'password123' })
  userToken = userLogin.body.token

  const adminLogin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.ic', password: 'password123' })
  adminToken = adminLogin.body.token
})

afterAll(async () => {
  await prisma.attendance.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.$disconnect()
})

describe('Events', () => {
  test('GET /api/events sin auth - 200', async () => {
    const res = await request(app).get('/api/events')
    expect(res.status).toBe(200)
  })

  test('POST /api/events sin token - 401', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ title: 'Test', description: 'Test description', date: '2026-06-01T10:00:00.000Z', location: 'Test', area: 'Test', maxCapacity: 10, categoryId: 1 })
    expect(res.status).toBe(401)
  })

  test('POST /api/events con token USER - 403', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ title: 'Test', description: 'Test description', date: '2026-06-01T10:00:00.000Z', location: 'Test', area: 'Test', maxCapacity: 10, categoryId: 1 })
    expect(res.status).toBe(403)
  })

  test('POST /api/events con categoryId inexistente - 404', async () => {
  const res = await request(app)
    .post('/api/events')
    .set('Authorization', `Bearer ${organizerToken}`)
    .send({ title: 'Test Event', description: 'Test description long enough', date: '2026-06-01T10:00:00.000Z', location: 'Test location', area: 'Test area', categoryId: 99999 })
  expect(res.status).toBe(404)
})

  test('POST /api/events con token ORGANIZER - 201', async () => {
    const category = await prisma.category.findUnique({ where: { slug: 'test' } })
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({ title: 'Test Event', description: 'Test description long enough', date: '2026-06-01T10:00:00.000Z', location: 'Test location', area: 'Test area', maxCapacity: 10, categoryId: category.id })
    expect(res.status).toBe(201)
    eventId = res.body.id
  })

  test('POST + DELETE /api/events/:id/attend - 201 y 200', async () => {
    const attend = await request(app)
      .post(`/api/events/${eventId}/attend`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(attend.status).toBe(201)

    const cancel = await request(app)
      .delete(`/api/events/${eventId}/attend`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(cancel.status).toBe(200)
  })

  test('GET /api/events/areas sin auth - 200', async () => {
    const res = await request(app).get('/api/events/areas')
    expect(res.status).toBe(200)
  })

  test('GET /api/events/abc - 400', async () => {
    const res = await request(app).get('/api/events/abc')
    expect(res.status).toBe(400)
  })

  test('GET /api/events/:id/attend con token - 200', async () => {
    const res = await request(app)
      .get(`/api/events/${eventId}/attend`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
  })

  test('GET /api/categories sin auth - 200', async () => {
    const res = await request(app).get('/api/categories')
    expect(res.status).toBe(200)
  })

  test('GET /api/users/me/attendances con token - 200', async () => {
    const res = await request(app)
      .get('/api/users/me/attendances')
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
  })

  test('GET /api/users/me/events con token ORGANIZER - 200', async () => {
    const res = await request(app)
      .get('/api/users/me/events')
      .set('Authorization', `Bearer ${organizerToken}`)
    expect(res.status).toBe(200)
  })

  test('PUT /api/events/:id con token ORGANIZER - 200', async () => {
    const category = await prisma.category.findUnique({ where: { slug: 'test' } })
    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({ title: 'Updated Event', description: 'Updated description', date: '2026-06-01T10:00:00.000Z', location: 'Updated location', area: 'Test area', categoryId: category.id })
    expect(res.status).toBe(200)
  })

  test('GET /api/admin/users con token ADMIN - 200', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  test('GET /api/admin/events con token ADMIN - 200', async () => {
    const res = await request(app)
      .get('/api/admin/events')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })

  test('DELETE /api/events/:id con token ORGANIZER - 200', async () => {
    const res = await request(app)
      .delete(`/api/events/${eventId}`)
      .set('Authorization', `Bearer ${organizerToken}`)
    expect(res.status).toBe(200)
  })

  test('DELETE /api/admin/users/:id con token ADMIN - 200', async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${deleteTargetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })
})
