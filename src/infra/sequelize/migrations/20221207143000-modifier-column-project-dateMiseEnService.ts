import { DataTypes, Op, QueryInterface } from 'sequelize'
import { models } from '../models'
export default {
  up: async (queryInterface: QueryInterface) => {
    const entrées = await models.Project.count({
      where: {
        dateMiseEnService: {
          [Op.ne]: null,
        },
      },
    })

    if (entrées > 0) {
      console.log('migration annulée car des entrées sont présente en base')
      return
    }

    await queryInterface.removeColumn('projects', 'dateMiseEnService')
    await queryInterface.addColumn('projects', 'dateMiseEnService', {
      type: DataTypes.DATE,
      allowNull: true,
    })
  },
  down: async () => {},
}
