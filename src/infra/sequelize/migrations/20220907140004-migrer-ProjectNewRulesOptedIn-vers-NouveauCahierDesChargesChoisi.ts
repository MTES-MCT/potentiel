import { NouveauCahierDesChargesChoisi } from '@modules/project'
import { QueryInterface, Sequelize } from 'sequelize'
import { toPersistance } from '../helpers'
import { models } from '../models'

type ProjectNewRulesOptedIn = {
  occurredAt: Date
  type: 'ProjectNewRulesOptedIn'
  payload: {
    projectId: string
    optedInBy: string
    cahierDesCharges: {
      id: string
      référence: string
    }
  }
}

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { EventStore } = models

      const evenementsAMigrer: ProjectNewRulesOptedIn[] = await EventStore.findAll(
        {
          where: {
            type: 'ProjectNewRulesOptedIn',
          },
        },
        { transaction }
      )

      const nouveauxÉvénements = evenementsAMigrer.map(
        ({ occurredAt, payload: { projectId: projetId, optedInBy: choisiPar } }) =>
          new NouveauCahierDesChargesChoisi({
            payload: {
              projetId,
              choisiPar,
              cahierDesCharges: { id: 'CDC 2021', référence: '2021' },
            },
            original: {
              occurredAt,
              version: 1,
            },
          })
      )

      console.log(
        `${nouveauxÉvénements.length} nouveaux événements ${NouveauCahierDesChargesChoisi.type} vont être ajoutés`
      )

      await EventStore.bulkCreate(nouveauxÉvénements.map(toPersistance), { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {},
}
