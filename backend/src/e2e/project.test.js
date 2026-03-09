import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import { prisma } from '../prismaClient.js'

let token
let projectId
let userId;

beforeAll(async () => {
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()
  await prisma.$disconnect()
})

describe("create project and add member", () => {

  test('should create a  user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser1',
        password: 'testpassword1',
        email: 'test1@test.com'
      })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    token = res.body.token
    const user = await prisma.user.findUnique({ where: { username: 'testuser1' } })
    userId = user.id
  })

    test("should create a project", async () => {
    const res = await request(app)
      .post('/api/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "projecttesttitle",
        description: "projecttestdescription"
      })

    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    projectId = res.body.id

    const project = await prisma.project.findUnique({ where: { id: projectId } })
    expect(project).not.toBeNull()
    expect(project.title).toBe("projecttesttitle")
  })

  const testDate = new Date();

  test("should create an assignment and add the owner as an assignee", async () => {
    const res = await request(app)
      .post(`/api/assignment/create/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "assignmenttesttitle",
        description: "assignmenttestdescription",
        assignees: [Number(userId)],
        dueDate: testDate
      })

        const assignments = await prisma.assignment.findMany({where: {projectId: projectId}})
        expect(res.status).toBe(201);
        expect(res.body).toEqual({success: true})
        expect(assignments).not.toBeNull;
        expect(assignments.length).toBe(1)
        expect(assignments[0]).toEqual(expect.objectContaining({
            title: "assignmenttesttitle",
            description: "assignmenttestdescription",
        }))
  })

})