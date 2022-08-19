import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { Payload } from './Payload'
import { sequelizeInstance } from '../../../../sequelize.config'
import { makeSequelizeProjector } from '../../helpers'

class ProjectEvent extends Model<
  InferAttributes<ProjectEvent>,
  InferCreationAttributes<ProjectEvent>
> {
  id: string
  projectId: string
  type: string
  payload: Payload | null
  valueDate: number
  eventPublishedAt: number
}

const nomProjection = 'project_events'

ProjectEvent.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSON,
    },
    valueDate: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    eventPublishedAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: true,
    freezeTableName: true,
  }
)

const ProjectEventProjector = makeSequelizeProjector(ProjectEvent, nomProjection)

export { ProjectEvent, ProjectEventProjector }
