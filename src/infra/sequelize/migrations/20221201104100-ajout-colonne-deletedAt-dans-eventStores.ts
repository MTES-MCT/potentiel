import { DataTypes, QueryInterface } from 'sequelize'

export default {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn('eventStores', 'deletedAt', {
      type: DataTypes.DATE,
      allowNull: true,
    })
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn('eventStores', 'deletedAt')
  },
}
