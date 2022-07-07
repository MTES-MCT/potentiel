import { Op, QueryInterface, Sequelize } from 'sequelize'

import { ModificationRequested } from '@modules/modificationRequest'
import { DélaiDemandé } from '@modules/demandeModification'

import { models } from '../models'
import { toPersistance } from '../helpers'

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    const { ModificationRequest, Project, EventStore } = models

    try {
      const demandesDélaiAMigrer: Array<{ id: string; project: { completionDueOn: number } }> =
        await ModificationRequest.findAll(
          {
            include: [
              {
                model: Project,
                as: 'project',
                attributes: ['completionDueOn'],
                required: true,
              },
            ],
            where: {
              type: 'delai',
              status: ['envoyée', 'en instruction'],
            },
            attributes: ['id'],
          },
          { transaction }
        )

      console.log(`${demandesDélaiAMigrer.length} demandes de délai envoyées à migrer`)

      const nouveauxÉvénements = await Promise.all(
        demandesDélaiAMigrer.map(async (demandeDélaiAMigrer) => {
          const événement: ModificationRequested | undefined = await EventStore.findOne(
            {
              where: {
                aggregateId: { [Op.overlap]: [demandeDélaiAMigrer.id] },
                type: 'ModificationRequested',
              },
            },
            { transaction }
          )

          if (événement) {
            const { payload, occurredAt } = événement

            if (payload.type === 'delai') {
              const dateThéoriqueDAchèvement = new Date(demandeDélaiAMigrer.project.completionDueOn)
              const dateAchèvementDemandée = new Date(
                dateThéoriqueDAchèvement.setMonth(
                  dateThéoriqueDAchèvement.getMonth() + payload.delayInMonths
                )
              ).toISOString()

              return new DélaiDemandé({
                payload: {
                  demandeDélaiId: payload.modificationRequestId,
                  projetId: payload.projectId,
                  autorité: payload.authority,
                  fichierId: payload.fileId,
                  justification: payload.justification,
                  dateAchèvementDemandée,
                  porteurId: payload.requestedBy,
                },
                original: {
                  occurredAt,
                  version: 1,
                },
              })
            }
          }
        })
      )

      console.log(`${nouveauxÉvénements.length} nouveaux événements DélaiDemandé vont être ajoutés`)

      await EventStore.bulkCreate(
        nouveauxÉvénements
          .filter((e): e is DélaiDemandé => e?.type === 'DélaiDemandé')
          .map(toPersistance),
        { transaction }
      )

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {},
}
