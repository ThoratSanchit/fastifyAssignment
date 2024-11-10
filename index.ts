import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import cors from "@fastify/cors"; // Import CORS plugin
import studentRoutes from "./route/student.router";
import userRouter from "./route/user.router";
import fileUploadRoutes from "./route/fileUpload.router";
import { checkDatabaseConnection } from "./db/db";

const fastify = Fastify({ logger: true });

// Register CORS plugin to enable Cross-Origin Resource Sharing for all routes
fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Log incoming requests
fastify.addHook("onRequest", async (request, reply) => {
  const { method, url } = request;
  fastify.log.info(`Incoming request in middleware: ${method} ${url}`);
});

fastify.register(swagger, {
  openapi: {
    info: {
      title: "API Documentation",
      description: "API documentation for the Fastify project",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
});

fastify.register(swaggerUi, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
});

fastify.register(studentRoutes);
fastify.register(userRouter);
fastify.register(fileUploadRoutes);

fastify.get("/json", async (request, reply) => {
  try {
    throw new Error("An example error occurred");
  } catch (error) {
    reply.send(error);
  }
});

fastify.get("/text", async (request, reply) => {
  return "hello world";
});

fastify.get("/jsonFormat", async (request, reply) => {
  reply.code(200).send({
    message: "Hello world!",
  });
});




fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(`Error occurred: ${error.message}`, error);
  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    status: "error",
    message: error.message || "An unexpected error occurred.",
  });
});

const start = async () => {
  try {
    await checkDatabaseConnection();
    await fastify.listen({ port: 3000 });
    console.log("Server is running on port 3000");
    console.log(
      "Swagger documentation available at http://localhost:3000/documentation"
    );

    const shutdown = async () => {
      try {
        await fastify.close();
        console.log("Server closed gracefully.");
        process.exit(0);
      } catch (error) {
        fastify.log.error("Error during shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    fastify.log.error("Server failed to start:", error);
    process.exit(1);
  }
};

start();
