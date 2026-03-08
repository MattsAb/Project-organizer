import { describe, test, expect, vi, beforeEach } from 'vitest'
import { loginUser, registerUser } from '../controllers/user.controller.js'
import { prisma } from '../prismaClient.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

vi.mock('../prismaClient.js', () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn()
    }
  }
}))


const mockRequest = {
    body: {
        username: "testusername",
        password: "testpassword",
        email: "testemail@gmail.com"
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
describe("registerUser", () => {

    test("should return status code 200 and a jwt token", async () => {
        prisma.user.create.mockResolvedValue({ id: 1, username: "testusername" })
        vi.spyOn(bcrypt, "hashSync").mockReturnValue("hashedPassword");
        vi.spyOn(jwt, "sign").mockReturnValue('token');
        await registerUser(mockRequest,mockResponse);

        expect(jwt.sign).toHaveBeenCalledTimes(1);
        expect(bcrypt.hashSync).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({token: "token"});
        expect(prisma.user.create).toHaveBeenCalledTimes(1)
    })

})

describe("loginUser", () => {

    test("should return status code 200 and a jwt token", async () => {
        prisma.user.findUnique.mockResolvedValue({ id: 1, username: "testusername" })
        vi.spyOn(bcrypt, "compareSync").mockReturnValue(true);
        vi.spyOn(jwt, "sign").mockReturnValue('token');
        await loginUser(mockRequest,mockResponse);
        
        expect(jwt.sign).toHaveBeenCalledTimes(1);
        expect(bcrypt.compareSync).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({token: "token"});
        expect(prisma.user.findUnique).toHaveBeenCalledTimes(1)
    })

    test("should return status code 404 and a message", async () => {
        prisma.user.findUnique.mockResolvedValue(null)
        await loginUser(mockRequest,mockResponse);

        expect(jwt.sign).not.toHaveBeenCalled();
        expect(bcrypt.compareSync).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "User not found"});
        expect(prisma.user.findUnique).toHaveBeenCalledTimes(1)
    })

    test("should return status code 401 and a message if they provide the wrong password", async () => {
        prisma.user.findUnique.mockResolvedValue({ id: 1, username: "testusername" })
        vi.spyOn(bcrypt, "compareSync").mockReturnValue(false);
        
        await loginUser(mockRequest,mockResponse);

        expect(jwt.sign).not.toHaveBeenCalled();
        expect(bcrypt.compareSync).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "Invalid password"});
        expect(prisma.user.findUnique).toHaveBeenCalledTimes(1)
    })

    
})