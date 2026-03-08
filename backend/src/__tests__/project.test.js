import { describe, test, expect, vi, beforeEach } from 'vitest'
import { prisma } from '../prismaClient.js'
import { getDashboard, kickMember } from '../controllers/project.controller.js'

vi.mock('../prismaClient.js', () => ({
  prisma: {
    projectMember: {
      delete: vi.fn().mockResolvedValue({}),
      findUnique: vi.fn().mockResolvedValue({})
    },
    project: {
        findMany: vi.fn().mockResolvedValue({})
    },
    assignment: {
        findMany: vi.fn().mockResolvedValue({})
    }
}}))

const mockRequest = {
    userId: 1,
    params: { 
        memberId: 1,
    }
}

const mockResponse = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis()
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("kickMember", () => {
    test("should return status code 200 and an object with succes: true", async () => {

        prisma.projectMember.findUnique.mockResolvedValue({id: 1,role: "MEMBER"})
        await kickMember(mockRequest,mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({success: true})
        expect(prisma.projectMember.findUnique).toBeCalledWith({
            where: {id: mockRequest.params.memberId}
        })
        expect(prisma.projectMember.delete).toBeCalledWith({
            where: {id: mockRequest.params.memberId}
        })

    })

    test("should return status code 404 and a message if no member", async () => {

        prisma.projectMember.findUnique.mockResolvedValue(null)
        await kickMember(mockRequest,mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "Member not found" })
        expect(prisma.projectMember.findUnique).toBeCalledWith({
            where: {id: mockRequest.params.memberId}
        })
        expect(prisma.projectMember.delete).not.toHaveBeenCalled()

    })

    test("should return status code 403 and a message when trying to kick OWNER", async () => {

        prisma.projectMember.findUnique.mockResolvedValue({id:1, role: "OWNER"})
        await kickMember(mockRequest,mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: "Can't kick the Owner of the project" })
        expect(prisma.projectMember.findUnique).toBeCalledWith({
            where: {id: mockRequest.params.memberId}
        })
        expect(prisma.projectMember.delete).not.toHaveBeenCalled()

    })

})

describe("getDashboard", () => {

    test("should return status code 200 and to objects projects and assignments", async () => {
        prisma.project.findMany.mockResolvedValue([1,2,3,4,5]);
        prisma.assignment.findMany.mockResolvedValue([1,2,3,4,5]);
        await getDashboard(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({projects: [1,2,3,4,5], assignments: [1,2,3,4,5]})
        expect(prisma.project.findMany).toHaveBeenCalledTimes(1);
        expect(prisma.assignment.findMany).toHaveBeenCalledTimes(1);
    } )
})
