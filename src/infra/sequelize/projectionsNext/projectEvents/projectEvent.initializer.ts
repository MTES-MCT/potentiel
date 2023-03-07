import { DataTypes, Sequelize } from 'sequelize';
import { ProjectEvent, projectEventTableName } from './projectEvent.model';

export const initializeProjectEventModel = (sequelize: Sequelize) => {
  ProjectEvent.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payload: {
        type: DataTypes.JSON,
      },
      valueDate: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      eventPublishedAt: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: projectEventTableName,
      timestamps: true,
      freezeTableName: true,
    },
  );
};
