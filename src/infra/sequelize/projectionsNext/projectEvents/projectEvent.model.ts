import { DataTypes } from 'sequelize'
import { sequelizeInstance } from '../../../../sequelize.config'
import { withSequelizeProjector } from '../../helpers'

export const ProjectEvent = withSequelizeProjector(() => {
  const model = sequelizeInstance.define(
    'project_events',
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
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  )

  model.associate = (models) => {}

  return model
})
