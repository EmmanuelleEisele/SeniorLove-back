import sequelize from './sequelize';
import {Model, DataTypes} from "sequelize";

export class RefreshToken extends Model{};

RefreshToken.init({
   token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
})