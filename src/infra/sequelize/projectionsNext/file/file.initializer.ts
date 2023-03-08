import { DataTypes, Sequelize } from 'sequelize';
import { File, fileTableName } from './file.model';

export const initializeFileModel = (sequelize: Sequelize) => {
  File.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      forProject: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      storedAt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
    },
    {
      timestamps: true,
      tableName: fileTableName,
      sequelize,
    },
  );
};
