import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

interface Student {
    id: string;
    name: string;
    class: string;
}

const students: Student[] = [
    { id: '1', name: 'sanchit', class: 'A' },
    { id: '2', name: 'bhushan', class: 'B' },
    { id: '3', name: 'ram', class: 'A' },
    { id: '4', name: 'ramesh', class: 'B' },
];

async function studentRoutes(fastify: FastifyInstance) {

    fastify.get('/student/:id', {
        schema: {
            description: 'Get a student by ID',
            tags: ['Students'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                },
                required: ['id'],
            },
            response: {
                200: {
                    description: 'Student details',
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        class: { type: 'string' },
                    },
                },
                404: {
                    description: 'Student not found',
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
            },
        },
    }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const { id } = request.params;
        const student = students.find(s => s.id === id);

        if (!student) {
            return reply.status(404).send({ error: 'Student not found' });
        }

        return student;
    });

    fastify.get('/student', {
        schema: {
            description: 'Get students by class',
            tags: ['Students'],
            querystring: {
                type: 'object',
                properties: {
                    class: { type: 'string' },
                },
                required: ['class'],
            },
            response: {
                200: {
                    description: 'List of students in a class',
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            class: { type: 'string' },
                        },
                    },
                },
                400: {
                    description: 'Class parameter required',
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
            },
        },
    }, async (request: FastifyRequest<{ Querystring: { class?: string } }>, reply: FastifyReply) => {
        const { class: className } = request.query;
console.log("hh")
        if (!className) {
            return reply.status(400).send({ error: 'Class query parameter is required' });
        }
        
        const studentsInClass = students.filter(s => s.class === className);

        return studentsInClass.length ? studentsInClass : { message: 'No students found in this class' };
    });
}

export default studentRoutes;
