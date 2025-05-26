import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export class Event extends Model{};

Event.init({
    name: {
        type: DataTypes.STRING(50), //VARCHAR(50)
        allowNull: false, //NOT NULL 
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false, //NOT NULL
    },
    description: {
        type: DataTypes.STRING(250), //VARCHAR(50)
        allowNull: false, //NOT NULL 
    },
    availability: {
        type: DataTypes.INTEGER //NUMBER
    },
    disponibility: {
        type: DataTypes.BOOLEAN, //Y/N
    },
    picture: {
        type: DataTypes.TEXT, 
    }
}, {
    sequelize, // sequelize: sequelize
    tableName: 'event'
});