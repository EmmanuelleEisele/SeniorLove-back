import { sequelize } from "./sequelize.js";
import { Model,DataTypes } from "sequelize";

export class User extends Model{};

User.init(
    {         
        pseudo: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true

        },
        email:{
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        firstname:{
            type: DataTypes.STRING(50),
            //allowNull: false
        },
        lastname:{
            type: DataTypes.STRING(50),
            //allowNull: false
        },
        password:{
            type: DataTypes.STRING(100),
            allowNull: false
        },
        birth_date:{
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        gender:{
            type: DataTypes.STRING(10),
            allowNull: false
        },
        profile_picture:{
            type: DataTypes.TEXT,
        },
        description:{
            type: DataTypes.STRING(250),
        },
        role:{
            type: DataTypes.STRING(50),
            allowNull: false
        },
        interest:{
            type: DataTypes.JSON(),
        }
    },
    {
        sequelize,
        tableName: 'users'
    }
);