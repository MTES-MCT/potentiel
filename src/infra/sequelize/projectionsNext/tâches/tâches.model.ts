import { RésultatTâcheMaJMeS } from '@modules/imports/gestionnaireRéseau/events'
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize'
import { sequelizeInstance } from '../../../../sequelize.config'
import { makeSequelizeProjector } from '../../helpers'

const typesTâche = ['maj-date-mise-en-service'] as const
export type TâchesType = typeof typesTâche[number]

const étatsPossibles = ['en cours', 'terminée'] as const

class Tâches extends Model<InferAttributes<Tâches>, InferCreationAttributes<Tâches>> {
  id: CreationOptional<number>
  gestionnaire: string
  type: TâchesType
  état: typeof étatsPossibles[number]
  dateDeDébut: Date
  dateDeFin?: Date
  nombreDeSucces?: number
  nombreDEchecs?: number
  résultat?: RésultatTâcheMaJMeS
}

const nomProjection = 'taches'

Tâches.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gestionnaire: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    état: {
      type: DataTypes.ENUM(...étatsPossibles),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...typesTâche),
      allowNull: false,
    },
    dateDeDébut: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateDeFin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nombreDeSucces: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nombreDEchecs: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    résultat: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['gestionnaire', 'type', 'dateDeDébut'],
      },
    ],
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: false,
    freezeTableName: true,
  }
)

const TâchesProjector = makeSequelizeProjector(Tâches, nomProjection)

export { Tâches, TâchesProjector }
