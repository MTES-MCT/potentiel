import { QueryInterface, DataTypes } from 'sequelize'

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.removeConstraint('taches', 'tache_unique_gestionnaire_type_dateDeDébut')
    await queryInterface.changeColumn('taches', 'type', {
      type: DataTypes.TEXT,
      allowNull: false,
    })
    await queryInterface.sequelize.query(`drop type enum_taches_type;`)
    await queryInterface.sequelize.query(`update taches set type = 'maj-données-de-raccordement';`)
    await queryInterface.changeColumn('taches', 'type', {
      type: DataTypes.ENUM('maj-données-de-raccordement'),
      allowNull: false,
    })
    queryInterface.addConstraint('taches', {
      fields: ['gestionnaire', 'type', 'dateDeDébut'],
      type: 'unique',
      name: 'tache_unique_gestionnaire_type_dateDeDébut',
    })
  },

  async down() {},
}
