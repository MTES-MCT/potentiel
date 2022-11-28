import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { sequelizeInstance } from '../../../../sequelize.config'
import { makeSequelizeProjector } from '../../helpers'

export const garantiesFinancièresStatuts = ['en attente', 'à traiter', 'validé'] as const
type GarantiesFinancièresStatut = typeof garantiesFinancièresStatuts[number]

class GarantiesFinancières extends Model<
  InferAttributes<GarantiesFinancières>,
  InferCreationAttributes<GarantiesFinancières>
> {
  id: string
  projetId: string
  statut: GarantiesFinancièresStatut
  soumisALaCandidature: boolean
  dateLimiteEnvoi?: Date
  fichierId?: string
  dateEnvoi?: Date
  envoyéPar?: string
  dateConstitution?: Date
  dateEchéance?: Date
  validéPar?: string
  validéLe?: Date
}

const nomProjection = 'garantiesFinancières'

GarantiesFinancières.init(
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
    statut: {
      type: DataTypes.ENUM(...garantiesFinancièresStatuts),
      allowNull: false,
    },
    soumisALaCandidature: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    dateLimiteEnvoi: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fichierId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    dateEnvoi: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    envoyéPar: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    dateConstitution: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateEchéance: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    validéPar: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    validéLe: {
      type: DataTypes.DATE,
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

const GarantiesFinancièresProjector = makeSequelizeProjector(GarantiesFinancières, nomProjection)

export { GarantiesFinancières, GarantiesFinancièresProjector }
