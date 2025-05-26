import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export class Activity extends Model{};

Activity.init({
    name: {
        type: DataTypes.STRING(50), //VARCHAR(50)
        allowNull: false, //NOT NULL
        unique: true     // UNIQUE 
    }
}, {
    sequelize, // sequelize: sequelize
    tableName: 'activity'
});