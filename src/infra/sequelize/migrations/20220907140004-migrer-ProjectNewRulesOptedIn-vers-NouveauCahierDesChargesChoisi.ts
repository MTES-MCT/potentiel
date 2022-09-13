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
      console.log(`${evenementsAMigrer.length} événements ProjectNewRulesOptedIn à migrer`)

      const nouveauxÉvénements = evenementsAMigrer.map((evenement) => {
        const {
          occurredAt,
          payload: { projectId: projetId, optedInBy: choisiPar },
        } = evenement

        return new NouveauCahierDesChargesChoisi({
          payload: {
            projetId,
            choisiPar,
            paruLe: '30/07/2021',
          },
          original: {
            occurredAt,
            version: 1,
          },
        })
      })

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
