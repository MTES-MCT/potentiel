'use strict'

import { QueryInterface, Sequelize } from 'sequelize'
import { FonctionUtilisateurModifiée } from '@modules/users'
import { logger } from '@core/utils'
import { toPersistance } from '../helpers'
import models from '../models'

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { User, EventStore } = models

      const userId = 'e3b6e352-da66-493a-9bef-9a4bd172bf79'

      // Mise à jour de la projection Users
      await User.update(
        {
          fonction: 'Sous-directeur du système électrique et des énergies renouvelables',
        },
        { where: { id: userId }, transaction }
      )

      // Ajout des événements dans l'EventStore
      const utilisateurCible = await User.findOne(
        { where: { id: userId }, attributes: ['email'] },
        { transaction }
      )

      if (!utilisateurCible) {
        logger.error(`L'utilisateur cible avec l'id ${userId} n'a pas été trouvé`)
        return
      }

      const {
        dataValues: { email },
      } = utilisateurCible

      await EventStore.create(
        toPersistance(
          new FonctionUtilisateurModifiée({
            payload: {
              userId,
              email,
              fonction: 'Sous-directeur du système électrique et des énergies renouvelables',
            },
          })
        ),
        { transaction }
      )

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
