import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

class Incident extends Model {
  public id!: number;
  public userId!: string;
  public type!: string;
  public description!: string;
  public summary?: string;
}

Incident.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    summary: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Incident',
    timestamps: true,
  }
);

export default Incident;