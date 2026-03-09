import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { prisma } from '../prismaClient.js'

beforeAll(async () => {
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.user.deleteMany()
  await prisma.$disconnect()
})

describe('register and login user', () => {
  let token

  test('should create a  user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
        email: 'test@test.com'
      })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    token = res.body.token
  })

  test('should return a token with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword'
      })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    token = res.body.token
  })

  test('should return status code 401 without token', async () => {
    const res = await request(app).get('/api/')

    expect(res.status).toBe(401)
  })

  test('should return status code 200 with valid token', async () => {
    const res = await request(app)
      .get('/api/')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
  })
})