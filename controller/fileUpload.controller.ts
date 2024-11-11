import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import path from 'path';
import { MultipartFile } from '@fastify/multipart';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];

export const uploadFile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
   
    const data = await request.file(); 

    if (!data) {
      return reply.status(400).send({ message: 'No file uploaded' });
    }

    //exe not accept
    const extension = path.extname(data.filename).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return reply.status(400).send({ message: 'Invalid file type. Only specific file types are allowed' });
    }

    
    const uploadPath = path.join(__dirname, '../uploads', data.filename);

    
    const fileStream = fs.createWriteStream(uploadPath);
    data.file.pipe(fileStream);


    data.file.on('end', () => {
      reply.status(200).send({ message: 'File uploaded successfully', filename: data.filename });
    });


    data.file.on('error', (err) => {
      console.error(err);
      reply.status(500).send({ message: 'File upload failed' });
    });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ message: 'File upload failed' });
  }
};
