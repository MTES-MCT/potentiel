import { DataTypes } from 'sequelize'

export const MakeProjectStepModel = (sequelize) => {
  const ProjectStep = sequelize.define(
    'project_step',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      dueOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      stepDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      fileId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      submittedOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      submittedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  )

  ProjectStep.associate = (models) => {
    // Add belongsTo etc. statements here
    const { File, User } = models
    ProjectStep.hasOne(File, {
      foreignKey: 'id',
      sourceKey: 'fileId',
      as: 'file',
    })
    ProjectStep.hasOne(User, {
      foreignKey: 'id',
      sourceKey: 'submittedBy',
      as: 'submittedByUser',
    })
  }

  return ProjectStep
}
