import { describe, test, expect, vi, beforeEach } from 'vitest'
import projectAuthMiddleware from '../middleware/projectAuth.js'
import { prisma } from '../prismaClient.js'

vi.mock('../prismaClient.js', () => ({
  prisma: {
    projectMember: {
      findUnique: vi.fn()
    }
  }
}))

const mockNext = vi.fn()

const mockRequest = {
  userId: 1,
  params: { id: '1' }
}

let mockResponse

beforeEach(() => {
  vi.clearAllMocks()
  mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  }
})

describe('projectAuthMiddleware', () => {

    test('should attach membership to the request and call next', async () => {
        prisma.projectMember.findUnique.mockResolvedValue({ role: 'ADMIN' })
        await projectAuthMiddleware(["ONWER","ADMIN"])(mockRequest,mockResponse,mockNext);

        expect(prisma.projectMember.findUnique).toHaveBeenCalledTimes(1)
        expect(mockRequest.membership).toBe('ADMIN');
        expect(mockNext).toHaveBeenCalled()
    })

        test('should return status code 403 and an error message if the user is not a member', async () => {
        mockRequest.membership = undefined
        prisma.projectMember.findUnique.mockResolvedValue(null)
        await projectAuthMiddleware(["ONWER","ADMIN","MEMBER"])(mockRequest,mockResponse,mockNext);

        expect(prisma.projectMember.findUnique).toHaveBeenCalledTimes(1)
        expect(mockRequest.membership).not.toBeDefined();
        expect(mockResponse.status).toBeCalledWith(403)
        expect(mockResponse.json).toBeCalledWith({message: "Not a project member"})
        expect(mockNext).not.toHaveBeenCalled()
    })

        test('should return status code 403 and an error message if the user is not a permitted', async () => {
        mockRequest.membership = undefined
        prisma.projectMember.findUnique.mockResolvedValue({role: "MEMBER"})
        await projectAuthMiddleware(["ONWER","ADMIN"])(mockRequest,mockResponse,mockNext);

        expect(prisma.projectMember.findUnique).toHaveBeenCalledTimes(1)
        expect(mockRequest.membership).not.toBeDefined();
        expect(mockResponse.status).toBeCalledWith(403)
        expect(mockResponse.json).toBeCalledWith({message: "Not permitted"})
        expect(mockNext).not.toHaveBeenCalled()
    })

})