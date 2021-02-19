import { DataTypes } from 'sequelize'

export const MakeProjectPTFModel = (sequelize) => {
  const ProjectPTF = sequelize.define(
    'project_ptf',
    {
      projectId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      ptfDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      fileId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      submittedOn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      submittedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  )

  ProjectPTF.associate = (models) => {
    // Add belongsTo etc. statements here
    const { File } = models
    ProjectPTF.hasOne(File, {
      foreignKey: 'id',
      sourceKey: 'fileId',
      as: 'file',
    })
  }

  return ProjectPTF
}
