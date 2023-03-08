import { DataTypes, NOW, Sequelize } from 'sequelize';
import { Project } from '../project/project.model';
import { File } from '../file/file.model';
import { User } from '../users/users.model';
import { ModificationRequest } from './modificationRequest.model';

export const initializeModificationRequestModel = (sequelize: Sequelize) => {
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
      sequelize,
      tableName: 'modificationRequests',
      timestamps: true,
    },
  );
};

export const initializeModificationRequestModelAssociations = () => {
  ModificationRequest.belongsTo(File, {
    foreignKey: 'fileId',
    as: 'attachmentFile',
    constraints: false,
  });

  ModificationRequest.belongsTo(File, {
    foreignKey: 'responseFileId',
    as: 'responseFile',
    constraints: false,
  });

  ModificationRequest.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project',
    constraints: false,
  });

  ModificationRequest.belongsTo(User, {
    foreignKey: 'userId',
    as: 'requestedBy',
    constraints: false,
  });
  ModificationRequest.belongsTo(User, {
    foreignKey: 'respondedBy',
    as: 'respondedByUser',
    constraints: false,
  });
  ModificationRequest.belongsTo(User, {
    foreignKey: 'confirmationRequestedBy',
    as: 'confirmationRequestedByUser',
    constraints: false,
  });
  ModificationRequest.belongsTo(User, {
    foreignKey: 'cancelledBy',
    as: 'cancelledByUser',
    constraints: false,
  });
};
