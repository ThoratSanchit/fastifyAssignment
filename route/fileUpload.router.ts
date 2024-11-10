import { FastifyInstance } from 'fastify';
import { uploadFile } from '../controller/fileUpload.controller';

async function fileUploadRoutes(fastify: FastifyInstance) {
  fastify.register(require('@fastify/multipart'));

  fastify.post('/upload', {
    schema: {
      description: 'Upload a file',
      tags: ['File Upload'],
      body: {
        type: 'object',
        properties: {
          file: { type: 'string', format: 'binary' },
        },
        required: ['file'],
      },
      response: {
        200: {
          description: 'File uploaded successfully',
          type: 'object',
          properties: {
            filename: { type: 'string' },
          },
        },
      },
    },
  }, uploadFile);
}

export default fileUploadRoutes;
