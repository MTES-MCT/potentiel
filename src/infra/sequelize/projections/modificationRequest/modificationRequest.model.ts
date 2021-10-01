import { DataTypes, NOW } from 'sequelize'
import { makeProjector } from '../../helpers'

export const modificationRequestProjector = makeProjector()

export const MakeModificationRequestModel = (sequelize) => {
  const ModificationRequest = sequelize.define(
    'modificationRequest',
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
      evaluationCarbone: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      delayInMonths: {
        type: DataTypes.INTEGER,
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
        default: false,
      },
    },
    {
      timestamps: true,
    }
  )

  ModificationRequest.associate = (models) => {
    const FileModel = models.File
    ModificationRequest.belongsTo(FileModel, {
      foreignKey: 'fileId',
      as: 'attachmentFile',
      constraints: false,
    })

    ModificationRequest.belongsTo(FileModel, {
      foreignKey: 'responseFileId',
      as: 'responseFile',
      constraints: false,
    })

    const ProjectModel = models.Project
    ModificationRequest.belongsTo(ProjectModel, {
      foreignKey: 'projectId',
      as: 'project',
      constraints: false,
    })

    const UserModel = models.User
    ModificationRequest.belongsTo(UserModel, {
      foreignKey: 'userId',
      as: 'requestedBy',
      constraints: false,
    })
    ModificationRequest.belongsTo(UserModel, {
      foreignKey: 'respondedBy',
      as: 'respondedByUser',
      constraints: false,
    })
    ModificationRequest.belongsTo(UserModel, {
      foreignKey: 'confirmationRequestedBy',
      as: 'confirmationRequestedByUser',
      constraints: false,
    })
    ModificationRequest.belongsTo(UserModel, {
      foreignKey: 'cancelledBy',
      as: 'cancelledByUser',
      constraints: false,
    })
  }

  ModificationRequest.projector = modificationRequestProjector

  return ModificationRequest
}
