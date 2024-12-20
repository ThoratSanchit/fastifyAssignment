import { FastifyRequest, FastifyReply } from "fastify";
import userModel from "../model/user.model";
import { UserInterface } from "../intarface/user.intarface";
import jwt from "jsonwebtoken";
const JWT_SECRET = "gy7gyuygygy6t7t";

export const postStudent = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const createUser = request.body as UserInterface;
    if (createUser.username.length < 3) {
      reply.code(200).send({
        message: "Username must have min length as 3 characters..",
      });
    }

    const user = await userModel.create({ ...createUser });

    reply.code(201).send({
      status_code: 201,
      id: user.id,
      users: user,
      message: "user created successfully.",
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return reply.status(404).send({ message: "Invalid email id." });
    }

    if (password !== user.password) {
      reply.send({
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    reply.status(200).send({
      status_code: 200,
      user: {
        id: user.id,
        username: user.name,
        email: user.email,
      },
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: "Internal Server Error" });
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
