import { DataTypes } from 'sequelize'

export const MakePeriodeModel = (sequelize) => {
  const Periode = sequelize.define(
    'periode',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      appelOffreId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      data: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  )

  Periode.associate = (models) => {
    // Add belongsTo etc. statements here
  }

  return Periode
}
