import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { sequelizeInstance } from '../../../../sequelize.config'
import { makeSequelizeProjector } from '../../helpers'

class Raccordements extends Model<
  InferAttributes<Raccordements>,
  InferCreationAttributes<Raccordements>
> {
  id: string
  projetId: string
  fichierId: string | null
  dateEnvoi: Date | null
  envoyéesPar: string | null
}

const nomProjection = 'raccordements'

Raccordements.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    projetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    fichierId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    dateEnvoi: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    envoyéesPar: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['projetId'],
      },
    ],
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: true,
    freezeTableName: true,
  }
)

const RaccordementsProjector = makeSequelizeProjector(Raccordements, nomProjection)

export { Raccordements, RaccordementsProjector }
