import { describe, test, expect, vi, beforeEach } from 'vitest'
import { getMessageInfo } from '../controllers/message.controller.js'
import { prisma } from '../prismaClient.js'

vi.mock('../prismaClient.js', () => ({
  prisma: {
    message: {
      update: vi.fn().mockResolvedValue({}),
      findUnique: vi.fn().mockResolvedValue({})
    },

  }
}))

const mockRequest = {
    params: { id: 1}
}

let mockResponse

beforeEach(() => {
  vi.clearAllMocks()
  mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  }
})

describe('getMessageInfo', () => {

    test('should return status code of 200 and the message object', async () => {
        prisma.message.findUnique.mockResolvedValue({id: 1, senderId: 2, description: "testDescription", body: "testBody"})
        await getMessageInfo(mockRequest, mockResponse)

        expect(prisma.message.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { isChecked: true }
        })
        expect(prisma.message.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { sender: { select: { username: true } } } // your controller includes this
        })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({message: {id: 1, senderId: 2, description: "testDescription", body: "testBody"}})
  })

})