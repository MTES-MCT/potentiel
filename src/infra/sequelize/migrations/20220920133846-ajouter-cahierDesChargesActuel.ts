import { DataTypes, QueryInterface } from 'sequelize'
import { cahierDesChargesIds } from '@entities'

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('projects', 'cahierDesChargesActuel', {
      type: DataTypes.ENUM(...cahierDesChargesIds),
      allowNull: false,
      defaultValue: 'initial',
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('users', 'fonction')
  },
}
