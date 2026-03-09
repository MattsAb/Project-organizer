import { describe, test, expect, vi, beforeEach } from 'vitest'
import { prisma } from '../prismaClient.js'
import { setProcess } from '../controllers/assignment.controller.js'

vi.mock('../prismaClient.js', () => ({
  prisma: {
    assignment: {
      update: vi.fn().mockResolvedValue({}),
      findUnique: vi.fn().mockResolvedValue({})
    },

  }
}))

const mockRequest = {
    userId: 1,
    params: { 
        id: 1,
    }
}

let mockResponse

beforeEach(() => {
  vi.clearAllMocks()
  mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  }
})

describe("setprocess", () => {
    test("should return status code 200 and an object with succes: true", async () => {
        prisma.assignment.findUnique.mockResolvedValue({
            id: 1,
            assignees: [{userId: 3},{userId: 1},{userId: 7}]
        })
        await setProcess(mockRequest,mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({success: true})
        expect(prisma.assignment.findUnique).toBeCalledWith({
            where: {id: mockRequest.params.id},
            include: {assignees: true}
        })
        expect(prisma.assignment.update).toBeCalledWith({
            where: {id: mockRequest.params.id},
            data: {status: "IN_PROGRESS"}
        })

    })

    test("should return status code 404 and a message if there is no assigment with given id", async () => {
        prisma.assignment.findUnique.mockResolvedValue(null)

        await setProcess(mockRequest,mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "Assignment not found"})
        expect(prisma.assignment.findUnique).toBeCalledWith({
            where: {id: mockRequest.params.id},
            include: {assignees: true}
        })
        expect(prisma.assignment.update).not.toHaveBeenCalled()

    })

    test("should return status code 403 and a message if user is not assigned to assignment", async () => {
        prisma.assignment.findUnique.mockResolvedValue({
            id: 1,
            assignees: [{userId: 3},{userId: 4},{userId: 7}]
        })

        await setProcess(mockRequest,mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "You are not assigned to this task"})
        expect(prisma.assignment.findUnique).toBeCalledWith({
            where: {id: mockRequest.params.id},
            include: {assignees: true}
        })
        expect(prisma.assignment.update).not.toHaveBeenCalled()

    })
})
