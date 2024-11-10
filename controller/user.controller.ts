import { FastifyRequest, FastifyReply } from "fastify";
import userModel from "../model/user.model";
import { UserInterface } from "../intarface/user.intarface";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key";
export const postStudent = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const createUser = request.body as UserInterface;
    if (createUser.username.length > 3) {
      reply.code(200).send({
        message: "username must have min length as 3 characters.",
      });
    }

    const user = await userModel.create({ ...createUser });

    reply.status(201).send({
      status_code: 201,
      id: user?.id,
      user,
      message: "user created successfully.",
    });
  } catch (error) {
    throw error;
  }
};





export const register = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const createUser = request.body as UserInterface;
  
      const user = await userModel.create({
        ...createUser,
      });
  
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });
  
      reply.status(201).send({
        status_code: 201,
        user,
        token,
        message: "User registered successfully.",
      });
    } catch (error) {
      console.error(error);
      reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  };
  
  export const protectedRoute = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const authHeader = request.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ message: "Unauthorized access" });
    }
  
    const token = authHeader.split(" ")[1];
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
      };
  
      reply.status(200).send({
        message: "Welcome to the protected route!",
        user: decoded,
      });
    } catch (error) {
      return reply.status(401).send({ message: "Invalid token" });
    }
  };
  


