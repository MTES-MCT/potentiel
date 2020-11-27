import { DataTypes } from 'sequelize'

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
    })

    const ProjectModel = models.Project
    ModificationRequest.belongsTo(ProjectModel, {
      foreignKey: 'projectId',
      as: 'project',
    })

    const UserModel = models.User
    ModificationRequest.belongsTo(UserModel, {
      foreignKey: 'userId',
      as: 'requestedBy',
    })
    // Add belongsTo etc. statements here
  }

  return ModificationRequest
}
