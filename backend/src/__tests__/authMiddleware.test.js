import { describe, test, expect, vi, beforeEach } from 'vitest'
import authMiddleware from '../middleware/auth'
import jwt from "jsonwebtoken"

const mockResponse = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis()
}

const mockRequest = {
    headers: {
        authorization: 'Bearer SOMEJWTTOKEN'
    }
}

const mockNext = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
})

describe("authMiddleware", () => {

    test('should attach userId to req and call next()', async () => {
        vi.spyOn(jwt, 'verify').mockReturnValue({ id: 1 })

        await authMiddleware(mockRequest, mockResponse, mockNext)

        expect(mockRequest.userId).toBe(1)
        expect(mockNext).toHaveBeenCalled()
        expect(mockResponse.status).not.toHaveBeenCalled()
    })

    test('should return a status code of 401 and an error message if not given a jwt token', async () => {
        const newMockRequest = {headers: { authorization: '' }}
        await authMiddleware(newMockRequest,mockResponse,mockNext)

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockNext).not.toBeCalled();
        expect(mockResponse.json).toBeCalledWith({ message: "Please Log in first" })
    })

    test('should return a status code 401 and an error message if jwt.verify fails', async () => {
        vi.spyOn(jwt, 'verify').mockImplementation(() => {
            throw new Error('Invalid token');
        })
        await authMiddleware(mockRequest, mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalled(401);
        expect(mockResponse.json).toBeCalledWith({ message: "Invalid token" });
        expect(mockNext).not.toHaveBeenCalled();
    })
})

