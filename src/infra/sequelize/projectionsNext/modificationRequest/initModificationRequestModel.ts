import { DataTypes, NOW } from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { ModificationRequest, modificationRequestTableName } from './modificationRequest.model';

export const initModificationRequestModel = () => {
  ModificationRequest.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      requestedOn: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      respondedOn: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      respondedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      responseFileId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      acceptanceParams: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      versionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: NOW,
      },
      authority: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fileId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      justification: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      actionnaire: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      producteur: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fournisseurs: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      puissance: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      puissanceAuMomentDuDepot: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      evaluationCarbone: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      delayInMonths: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      dateAchèvementDemandée: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      confirmationRequestedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      confirmationRequestedOn: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      confirmedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      confirmedOn: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      cancelledBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      cancelledOn: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      isLegacy: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      cahierDesCharges: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize: sequelizeInstance,
      tableName: modificationRequestTableName,
      timestamps: true,
    },
  );
};
