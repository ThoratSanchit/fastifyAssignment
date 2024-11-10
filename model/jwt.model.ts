import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/db';

class JwtModel extends Model {
    id: any;
    email: any;
}

JwtModel.init(
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
        tableName: 'jwt',
        timestamps: true,
    }
);

export default JwtModel;
