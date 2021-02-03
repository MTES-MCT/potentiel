import { DataTypes } from 'sequelize'

export const MakeProjectAdmissionKeyModel = (sequelize) => {
  const ProjectAdmissionKey = sequelize.define(
    'projectAdmissionKey',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      appelOffreId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      periodeId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dreal: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastUsedAt: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
    }
  )

  ProjectAdmissionKey.associate = (models) => {
    // Add belongsTo etc. statements here
  }

  return ProjectAdmissionKey
}
