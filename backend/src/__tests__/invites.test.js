import { describe, test, expect, vi, beforeEach } from 'vitest'
import { processInvite } from '../controllers/Invite.controller.js'
import { prisma } from '../prismaClient.js'

vi.mock('../prismaClient.js', () => ({
  prisma: {
    projectMember: {
      create: vi.fn().mockResolvedValue({})
    },
    projectInvite: {
      delete: vi.fn().mockResolvedValue({})
    }
  }
}))

const mockResponse = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis()
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('processInvite', () => {
  test('should create a new member and delete the invite', async () => {
    const mockRequest = {
      userId: 1,
      params: { inviteId: 1, projectId: 1 },
      query: { process: 'ACCEPTED' }
    }

    await processInvite(mockRequest, mockResponse)

    expect(prisma.projectMember.create).toHaveBeenCalledWith({
      data: { userId: 1, projectId: 1 }
    })
    expect(prisma.projectInvite.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true })
  })

  test('should not create a new member but delete the invite', async () => {
    const mockRequest = {
      userId: 1,
      params: { inviteId: 1, projectId: 1 },
      query: { process: 'DECLINED' }
    }

    await processInvite(mockRequest, mockResponse)

    expect(prisma.projectMember.create).not.toHaveBeenCalled()
    expect(prisma.projectInvite.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true })
  })
})