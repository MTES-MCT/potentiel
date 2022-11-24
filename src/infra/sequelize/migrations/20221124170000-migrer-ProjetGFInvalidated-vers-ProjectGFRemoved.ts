import { ProjectGFRemoved } from '@modules/project'
import { QueryInterface } from 'sequelize'
import { toPersistance } from '../helpers'
import { models } from '../models'

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { EventStore } = models

      const evenementsAMigrer = await EventStore.findAll(
        {
          where: {
            type: 'ProjectGFInvalidated',
          },
        },
        { transaction }
      )
      console.log(`${evenementsAMigrer.length} événements ProjectGFInvalidated à migrer`)

      const nouveauxÉvénements = evenementsAMigrer.map((evenement) => {
        const {
          occurredAt,
          payload: { projectId },
        } = evenement

        return new ProjectGFRemoved({
          payload: {
            projectId,
          },
          original: {
            occurredAt,
            version: 1,
          },
        })
      })

      console.log(
        `${nouveauxÉvénements.length} nouveaux événements ${ProjectGFRemoved.type} vont être ajoutés`
      )

      await EventStore.bulkCreate(nouveauxÉvénements.map(toPersistance), { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async () => {},
}
