import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { sequelizeInstance } from '../../../../sequelize.config'
import { makeSequelizeProjector } from '../../helpers'

type TasksPayload = {
  nombreDeSucces: number
  nombreDEchecs: number
}

export type TaskType = 'maj-date-mise-en-service'

class Tasks extends Model<InferAttributes<Tasks>, InferCreationAttributes<Tasks>> {
  id: string
  type: TaskType
  dateDeDébut: Date
  dateDeFin?: Date
  nombreDeSucces?: number
  nombreDEchecs?: number
}

const nomProjection = 'tasks'

Tasks.init(
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

const TasksProjector = makeSequelizeProjector(Tasks, nomProjection)

export { Tasks, TasksProjector }
