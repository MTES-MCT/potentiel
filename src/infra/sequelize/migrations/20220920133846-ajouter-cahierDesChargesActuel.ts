import { DataTypes, QueryInterface } from 'sequelize'
import { cahiersDesChargesRéférences } from '@entities'

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('projects', 'cahierDesChargesActuel', {
      type: DataTypes.ENUM(...cahiersDesChargesRéférences),
      allowNull: false,
      defaultValue: 'initial',
    })
  },

  down: async (queryInterface) => {
    queryInterface.removeColumn('users', 'fonction')
  },
}
