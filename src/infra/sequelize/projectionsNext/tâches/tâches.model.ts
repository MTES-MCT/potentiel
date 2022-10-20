import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { sequelizeInstance } from '../../../../sequelize.config'
import { makeSequelizeProjector } from '../../helpers'

export type TâchesType = 'maj-date-mise-en-service'

class Tâches extends Model<InferAttributes<Tâches>, InferCreationAttributes<Tâches>> {
  id: string
  type: TâchesType
  dateDeDébut: Date
  dateDeFin?: Date
  nombreDeSucces?: number
  nombreDEchecs?: number
}

const nomProjection = 'tasks'

Tâches.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
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
  },
  {
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: true,
    freezeTableName: true,
  }
)

const TâchesProjector = makeSequelizeProjector(Tâches, nomProjection)

export { Tâches, TâchesProjector }
