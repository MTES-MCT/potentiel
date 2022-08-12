import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { sequelizeInstance } from '../../../../sequelize.config'
import { makeSequelizeProjector } from '../../helpers'

class ProjectEvent extends Model<
  InferAttributes<ProjectEvent>,
  InferCreationAttributes<ProjectEvent>
> {
  declare id: string
  declare projectId: string
  declare type: string
  declare payload?: { [key: string]: unknown }
  declare valueDate: number | null
  declare eventPublishedAt: number
}

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
    tableName: 'project_events',
    timestamps: true,
    freezeTableName: true,
  }
)

const ProjectEventProjector = makeSequelizeProjector(ProjectEvent)

export { ProjectEvent, ProjectEventProjector }
