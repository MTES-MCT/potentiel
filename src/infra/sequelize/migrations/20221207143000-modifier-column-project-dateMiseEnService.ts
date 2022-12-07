import { DataTypes, QueryInterface } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('projects', 'dateMiseEnService')
    await queryInterface.addColumn('projects', 'dateMiseEnService', {
      type: DataTypes.DATE,
      allowNull: true,
    })
  },
  down: async () => {},
}
