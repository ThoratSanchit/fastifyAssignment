import { FastifyInstance } from "fastify";
import { postStudent, protectedRoute,login } from "../controller/user.controller";

async function userRouter(fastify: FastifyInstance) {
  fastify.post(
    "/user",
    {
      schema: {
        description: "Create a new user",
        tags: ["User"],
        body: {
          type: "object",
          properties: {
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
          required: ["username", "email", "password"],
        },
        response: {
          201: {
            description: "User created",
            type: "object",
            properties: {
              id: { type: "string" },
              username: { type: "string" },
              email: { type: "string" },
            },
          },
        },
      },
    },
    postStudent
  );

  fastify.post(
    "/protectedRoute",
    {
      schema: {
        description: "Access protected route",
        tags: ["User"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        response: {
          200: {
            description: "Protected route response",
            type: "object",
            properties: {
              message: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    protectedRoute
  );

fastify.post("/login",login);
}

export default userRouter;
