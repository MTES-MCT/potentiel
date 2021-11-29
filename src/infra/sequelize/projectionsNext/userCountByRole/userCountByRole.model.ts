import { DataTypes } from 'sequelize'
import { sequelizeInstance } from '../../../../sequelize.config'
import { withSequelizeProjector } from '../../helpers'

export const UserCountByRole = withSequelizeProjector(() => {
  const model = sequelizeInstance.define(
    'user_count_by_role',
    {
      role: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  )

  model.associate = (models) => {}

  return model
})
