import { QueryInterface } from 'sequelize'
import { FonctionUtilisateurModifiée, RôleUtilisateurModifié } from '@modules/users'
import { logger } from '@core/utils'
import { toPersistance } from '../helpers'
import models from '../models'

export default {
  async up(queryInterface: QueryInterface) {
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
      const utilisateurCible = await User.findOne(
        { where: { id: userId }, attributes: ['email'] },
        { transaction }
      )

      if (!utilisateurCible) {
        logger.error(`L'utilisateur cible avec l'id ${userId} n'a pas été trouvé`)
      } else {
        const {
          dataValues: { email },
        } = utilisateurCible

        await EventStore.create(
          toPersistance(
            new RôleUtilisateurModifié({
              payload: {
                userId,
                email,
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
                email,
                fonction:
                  'Adjoint au sous-directeur du système électrique et des énergies renouvelables',
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
