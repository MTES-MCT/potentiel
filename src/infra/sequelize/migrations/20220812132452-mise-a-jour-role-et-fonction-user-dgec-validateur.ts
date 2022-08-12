'use strict'

import { QueryInterface, Sequelize } from 'sequelize'
import { FonctionUtilisateurModifiée, RôleUtilisateurModifié } from '@modules/users'
import { toPersistance } from '../helpers'
import models from '../models'

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { User, EventStore } = models

      const userId = 'c520e2c5-74ad-47e6-a417-5a8020999a14'

      // Mise à jour de la projection Users
      await User.update(
        {
          role: 'dgec-validateur',
          fonction: 'Adjoint au sous-directeur du système électrique et des énergies renouvelables',
        },
        { where: { id: userId }, transaction }
      )

      // Ajout des événements dans l'EventStore
      const email = await User.findOne(
        { where: { id: userId }, attributes: ['email'] },
        { transaction }
      )

      await EventStore.create(
        toPersistance(
          new RôleUtilisateurModifié({
            payload: {
              userId,
              email: email.email,
              role: 'dgec-validateur',
            },
          })
        ),
        { transaction }
      )

      await EventStore.create(
        toPersistance(
          new FonctionUtilisateurModifiée({
            payload: {
              userId,
              email: email.email,
              fonction:
                'Adjoint au sous-directeur du système électrique et des énergies renouvelables',
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
