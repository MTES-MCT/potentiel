import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NOW,
} from 'sequelize'
import { sequelizeInstance } from '../../../sequelize.config'

class StatistiquesUtilisation extends Model<
  InferAttributes<StatistiquesUtilisation>,
  InferCreationAttributes<StatistiquesUtilisation>
> {
  id: CreationOptional<number>
  type: string
  date: Date
  données: JSON
}

StatistiquesUtilisation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW,
    },
    données: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['id'],
      },
    ],
    sequelize: sequelizeInstance,
    tableName: 'statistiquesUtilisation',
    modelName: 'StatistiquesUtilisation',
    timestamps: false,
    freezeTableName: true,
  }
)

export { StatistiquesUtilisation }
