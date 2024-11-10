import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DATABASE_NAME as string,
    process.env.DATABASE_USERNAME as string,
    process.env.DATABASE_PASSWORD as string,
    {
        host: process.env.DATABASE_HOST as string,
        dialect: 'mysql',
    }
);

const checkDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        sequelize.sync()
        console.log('Database connected successfully');
        return { connected: true, message: 'Database connected successfully' };
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return { connected: false, message: 'Database connection failed', error };
    }
};

export { sequelize, checkDatabaseConnection };

