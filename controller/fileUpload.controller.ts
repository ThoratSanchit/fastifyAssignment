// import { FastifyRequest, FastifyReply } from 'fastify';
// import fs from 'fs';
// import path from 'path';
// import { MultipartFile } from '@fastify/multipart';


// const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];

// export const uploadFile = async (request: FastifyRequest, reply: FastifyReply) => {
//   const data = await (request as FastifyRequest & { file: () => Promise<MultipartFile> }).file();
  
//   if (!data) {
//     return reply.status(400).send({ message: 'No file uploaded' });
//   }


//   const extension = path.extname(data.filename).toLowerCase();


//   if (!ALLOWED_EXTENSIONS.includes(extension)) {
//     return reply.status(400).send({ message: 'Invalid file type. Only specific file types are allowed' });
//   }


//   const uploadPath = path.join(__dirname, '../uploads', data.filename);


//   const fileStream = fs.createWriteStream(uploadPath);
//   let uploadedBytes = 0;

//   data.file.on('data', (chunk) => {
//     uploadedBytes += chunk.length;

   
//     const totalBytes = typeof data.file.truncated === 'number' ? data.file.truncated : uploadedBytes;

   
//     const progress = ((uploadedBytes / totalBytes) * 100).toFixed(2);
//     console.log(`Upload Progress: ${progress}%`);
//   });

 
//   data.file.pipe(fileStream);

//   data.file.on('end', () => {
//     reply.status(200).send({ message: 'File uploaded successfully', filename: data.filename });
//   });

//   data.file.on('error', (err) => {
//     console.error(err);
//     reply.status(500).send({ message: 'File upload failed' });
//   });
// };




// import { FastifyRequest, FastifyReply } from 'fastify';
// import fs from 'fs';
// import path from 'path';
// import { MultipartFile } from '@fastify/multipart';

// const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];

// export const uploadFile = async (request: FastifyRequest, reply: FastifyReply) => {
//   const data = await (request as FastifyRequest & { file: () => Promise<MultipartFile> }).file();

//   if (!data) {
//     return reply.status(400).send({ message: 'No file uploaded' });
//   }

//   const extension = path.extname(data.filename).toLowerCase();

//   if (!ALLOWED_EXTENSIONS.includes(extension)) {
//     return reply.status(400).send({ message: 'Invalid file type. Only specific file types are allowed' });
//   }

//   const uploadPath = path.join(__dirname, '../uploads', data.filename);

//   const fileStream = fs.createWriteStream(uploadPath);
//   let uploadedBytes = 0;

//   data.file.on('data', (chunk) => {
//     uploadedBytes += chunk.length;
//     const totalBytes = typeof data.file.truncated === 'number' ? data.file.truncated : uploadedBytes;
//     const progress = ((uploadedBytes / totalBytes) * 100).toFixed(2);
//     console.log(`Upload Progress: ${progress}%`);
//   });

//   data.file.pipe(fileStream);

//   data.file.on('end', () => {
//     reply.status(200).send({ message: 'File uploaded successfully', filename: data.filename });
//   });

//   data.file.on('error', (err) => {
//     console.error(err);
//     reply.status(500).send({ message: 'File upload failed' });
//   });
// };




import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import path from 'path';
import { MultipartFile } from '@fastify/multipart';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];

export const uploadFile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // Fetch the file from the request
    const data = await request.file(); // `file` will be automatically parsed by @fastify/multipart

    if (!data) {
      return reply.status(400).send({ message: 'No file uploaded' });
    }

    // Validate file extension
    const extension = path.extname(data.filename).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return reply.status(400).send({ message: 'Invalid file type. Only specific file types are allowed' });
    }

    // Define the path to save the uploaded file
    const uploadPath = path.join(__dirname, '../uploads', data.filename);

    // Create a write stream to save the file
    const fileStream = fs.createWriteStream(uploadPath);
    data.file.pipe(fileStream);

    // Handle file upload completion
    data.file.on('end', () => {
      reply.status(200).send({ message: 'File uploaded successfully', filename: data.filename });
    });

    // Handle file upload errors
    data.file.on('error', (err) => {
      console.error(err);
      reply.status(500).send({ message: 'File upload failed' });
    });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ message: 'File upload failed' });
  }
};
