import { DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { ProjectEvent, projectEventTableName } from './projectEvent.model';

export const initProjectEventModel = () => {
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
      sequelize: sequelizeInstance,
      tableName: projectEventTableName,
      timestamps: true,
      freezeTableName: true,
    },
  );
};
