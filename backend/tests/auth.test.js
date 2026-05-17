const request = require('supertest')
const app = require('../app')
const prisma = require('../lib/prisma')

beforeAll(async () => {
  await prisma.attendance.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.user.deleteMany({})
})

afterAll(async () => {
  await prisma.attendance.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.user.deleteMany({})
})

describe('Auth', () => {
  test('POST /api/auth/register → 201 con token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@test.ic', password: 'password123', role: 'USER' })
    expect(res.status).toBe(201)
    expect(res.body.token).toBeDefined()
  })

  test('POST /api/auth/register con email duplicado → 409', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@test.ic', password: 'password123', role: 'USER' })
    expect(res.status).toBe(409)
  })

  test('POST /api/auth/login con credenciales correctas → 200 con token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.ic', password: 'password123' })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
  })

  test('POST /api/auth/login con credenciales incorrectas → 401', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@test.ic', password: 'wrongpassword' })
  expect(res.status).toBe(401)
})

  
})
