import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export class Localisation extends Model{};

Localisation.init({
    city: {
        type: DataTypes.STRING(50), //VARCHAR(50)
        allowNull: false, //NOT NULL 
    },
    department: {
        type: DataTypes.STRING(50), //VARCHAR(50)
        allowNull: false, //NOT NULL 
    }
}, {
    sequelize, // sequelize: sequelize
    tableName: 'localisation'
});