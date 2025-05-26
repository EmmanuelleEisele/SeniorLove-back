import { Model, DataTypes } from "sequelize";
import { sequelize } from "./sequelize.js";

export class Conversation extends Model{};

Conversation.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false, //NOT NULL 
    },

    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false, //NOT NULL 
    },

    content: {
        type: DataTypes.TEXT, //chaque message sera stocké comme une chaîne de texte
        defaultValue: '', // <== texte vide par défaut
        allowNull: false, //NOT NULL 
    }

}, {
    sequelize, // sequelize: sequelize
    tableName: 'user_conversation',
    timestamps: true
});