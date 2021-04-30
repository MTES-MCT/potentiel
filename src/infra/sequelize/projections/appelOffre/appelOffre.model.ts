import { DataTypes } from 'sequelize'
import { makeProjector } from '../../helpers'

export const appelOffreProjector = makeProjector()

export const MakeAppelOffreModel = (sequelize) => {
  const AppelOffre = sequelize.define(
    'appelOffre',
    {
      id: {
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

  AppelOffre.associate = (models) => {
    // Add belongsTo etc. statements here
  }

  AppelOffre.projector = appelOffreProjector

  return AppelOffre
}
