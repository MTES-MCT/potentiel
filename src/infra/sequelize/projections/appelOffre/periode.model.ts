import { DataTypes } from 'sequelize'
import { makeProjector } from '../../helpers'

export const periodeProjector = makeProjector()

export const MakePeriodeModel = (sequelize) => {
  const Periode = sequelize.define(
    'periode',
    {
      periodeId: {
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

  Periode.projector = periodeProjector

  return Periode
}
