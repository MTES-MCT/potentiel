import { CahierDesChargesChoisi } from '@modules/project'
import { QueryInterface, Sequelize } from 'sequelize'
import { toPersistance } from '../helpers'
import { models } from '../models'

type NouveauCahierDesChargesChoisi = {
  occurredAt: Date
  type: 'NouveauCahierDesChargesChoisi'
  payload: {
    projetId: string
    choisiPar: string
    paruLe: '30/07/2021' | '30/08/2022'
    alternatif?: true
  }
}

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { EventStore } = models

      const evenementsAMigrer: NouveauCahierDesChargesChoisi[] = await EventStore.findAll(
        {
          where: {
            type: 'NouveauCahierDesChargesChoisi',
          },
        },
        { transaction }
      )
      console.log(`${evenementsAMigrer.length} événements NouveauCahierDesChargesChoisi à migrer`)

      const nouveauxÉvénements = evenementsAMigrer.map((evenement) => {
        const {
          occurredAt,
          payload: { projetId, choisiPar, paruLe, alternatif },
        } = evenement

        return new CahierDesChargesChoisi({
          payload: {
            projetId,
            choisiPar,
            type: 'modifié',
            paruLe,
            ...(alternatif && { alternatif: true }),
          },
          original: {
            occurredAt,
            version: 1,
          },
        })
      })

      console.log(
        `${nouveauxÉvénements.length} nouveaux événements ${CahierDesChargesChoisi.type} vont être ajoutés`
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
