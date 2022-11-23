import { QueryInterface } from 'sequelize'
import { ConnexionsParRoleEtParJour, StatistiquesUtilisation } from '../tableModels'

module.exports = {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const entrées = await ConnexionsParRoleEtParJour.findAll({})
      for (const entrée of entrées) {
        for (let i = 0; i < entrée.compteur; i++) {
          await StatistiquesUtilisation.create(
            {
              type: 'connexionUtilisateur',
              date: new Date(entrée.date),
              données: {
                utilisateur: { role: entrée.role },
              },
            },
            {
              transaction,
            }
          )
        }
      }
      await queryInterface.dropTable('connexionsParRoleEtParJour', { transaction })
      await transaction.commit()
    } catch (e) {
      console.error(e)
      await transaction.rollback()
    }
  },

  async down(queryInterface: QueryInterface) {},
}
