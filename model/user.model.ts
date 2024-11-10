import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/db';

class StudentAttributes extends Model {
    id: any;
    email: any;
}

StudentAttributes.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
           
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
     

        
    },
    {
        sequelize,
        tableName: 'user',
        timestamps: true,
    }
);

export default StudentAttributes;
