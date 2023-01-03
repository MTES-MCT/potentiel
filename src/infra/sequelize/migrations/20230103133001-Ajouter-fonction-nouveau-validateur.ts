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

      const userId = '1a51e953-9f2a-4d36-8feb-4a0c180fe6e2'

      const utilisateurCible = await User.findOne(
        { where: { id: userId }, attributes: ['email'] },
        { transaction }
      )

      if (!utilisateurCible) {
        logger.error(`L'utilisateur cible avec l'id ${userId} n'a pas été trouvé`)
      } else {
        await User.update(
          {
            fonction:
              'Adjointe au sous-directeur du système électrique et des énergies renouvelables',
          },
          { where: { id: userId }, transaction }
        )

        const {
          dataValues: { email },
        } = utilisateurCible

        await EventStore.create(
          toPersistance(
            new FonctionUtilisateurModifiée({
              payload: {
                userId,
                email,
                fonction:
                  'Adjointe au sous-directeur du système électrique et des énergies renouvelables',
              },
            })
          ),
          { transaction }
        )
      }

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {},
}
