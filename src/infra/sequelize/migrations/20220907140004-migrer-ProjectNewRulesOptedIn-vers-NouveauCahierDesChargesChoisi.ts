import { getProjectAppelOffre } from '@config/queries.config'
import { ProjectAppelOffre } from '@entities'
import { NouveauCahierDesChargesChoisi } from '@modules/project'
import { Op, QueryInterface, Sequelize } from 'sequelize'
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
      const { EventStore, Project } = models

      const evenementsAMigrer: ProjectNewRulesOptedIn[] = await EventStore.findAll(
        {
          where: {
            type: 'ProjectNewRulesOptedIn',
          },
        },
        { transaction }
      )
      console.log(`${evenementsAMigrer.length} événements ProjectNewRulesOptedIn à migrer`)

      const projets: Array<{ id: string; appelOffreId: string; periodeId: string }> =
        await Project.findAll(
          {
            where: {
              id: { [Op.in]: evenementsAMigrer.map(({ payload: { projectId } }) => projectId) },
            },
            attribute: ['id', 'appelOffreId', 'periodeId'],
          },
          { transaction }
        )

      const projetsAvecAo: { [id: string]: { appelOffre: ProjectAppelOffre } } = projets.reduce(
        (
          acc,
          { id, appelOffreId, periodeId }: { id: string; appelOffreId: string; periodeId: string }
        ) => ({
          ...acc,
          [id]: { appelOffre: getProjectAppelOffre({ appelOffreId, periodeId }) },
        }),
        {}
      )
      console.log(`${Object.entries(projetsAvecAo).keys.length} projets ont été récupérés`)

      const nouveauxÉvénements = evenementsAMigrer.map((evenement) => {
        const {
          occurredAt,
          payload: { projectId: projetId, optedInBy: choisiPar },
        } = evenement

        const projet = projetsAvecAo[projetId]
        if (!projet) {
          console.error(`Impossible de trouver le projet ${projetId}`)
          console.error(`Pour l'événement ${JSON.stringify(evenementsAMigrer)}`)
          throw new Error(`Projet introuvable`)
        }

        return new NouveauCahierDesChargesChoisi({
          payload: {
            projetId,
            choisiPar,
            cahierDesCharges: {
              référence: projet.appelOffre.periode.reference,
              paruLe: '30/07/2021',
            },
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
