import { FastifyInstance } from "fastify";
import { uploadFile } from "../controller/fileUpload.controller";

async function fileUploadRoutes(fastify: FastifyInstance) {
  fastify.register(require("@fastify/multipart"));

  fastify.post("/upload", uploadFile);
}

export default fileUploadRoutes;
