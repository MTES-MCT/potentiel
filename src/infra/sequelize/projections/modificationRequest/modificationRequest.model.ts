import { DataTypes, NOW } from 'sequelize'

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
        allowNull: false,
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
      versionDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: NOW,
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
      fournisseur: {
        type: DataTypes.STRING,
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
      delayedServiceDate: {
        type: DataTypes.BIGINT,
        allowNull: true,
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
    // Add belongsTo etc. statements here
  }

  return ModificationRequest
}
