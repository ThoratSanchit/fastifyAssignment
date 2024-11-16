import { FastifyRequest, FastifyReply } from "fastify";
import fs from "fs";
import path from "path";
import { MultipartFile } from "@fastify/multipart";

export const uploadFile = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ message: "No file uploaded" });
    }

    const extension = path.extname(data.filename).toLowerCase();

    if (extension === ".exe") {
      return reply.status(400).send({
        message: "Invalid file type. .exe file not allowed",
      });
    }
    const uploadPath = path.join(__dirname, "../uploads", data.filename);

    const fileStream = fs.createWriteStream(uploadPath);
    data.file.pipe(fileStream);

    reply.status(200).send({
      message: "File uploaded successfully",
      filename: data.filename,
    });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ message: "File upload failed" });
  }
};
