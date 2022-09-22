import { QueryInterface, Sequelize } from 'sequelize'
import models from '../models'

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { Project } = models

      const projetsAMettreAJour = await Project.update(
        {
          cahierDesChargesActuel: '30/07/2021',
        },
        {
          where: { nouvellesRèglesDInstructionChoisies: true },
        },
        { transaction }
      )
      console.log(
        `${projetsAMettreAJour[0]} projets on été mis à jour avec un cahierDesChargesActuel au '30/07/2021'`
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {},
}
