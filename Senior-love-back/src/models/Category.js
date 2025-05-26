import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export class Category extends Model{};

Category.init({
    name: {
        type: DataTypes.STRING(50), //VARCHAR(50)
        allowNull: false, //NOT NULL
        unique: true     // UNIQUE 
    }
}, {
    sequelize, // sequelize: sequelize
    tableName: 'category'
});
