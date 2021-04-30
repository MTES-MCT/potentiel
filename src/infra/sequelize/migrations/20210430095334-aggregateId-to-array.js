'use strict';

module.exports = {
  up: async (queryInterface, { DataTypes }) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.renameColumn('eventStores', 'aggregateId', 'oldAggregateId',
        {
          transaction,
        }
      )
      await queryInterface.addColumn('eventStores', 'aggregateId', { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
        {
          transaction,
        }
      );

      await queryInterface.sequelize.query(
        'UPDATE "eventStores" SET "aggregateId" = string_to_array("oldAggregateId", \' | \')',
        {
          transaction,
        }
      )

      await queryInterface.removeColumn('eventStores', 'oldAggregateId',
        {
          transaction,
        }
      )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
    // TODO: update sequelizeEventStore
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
