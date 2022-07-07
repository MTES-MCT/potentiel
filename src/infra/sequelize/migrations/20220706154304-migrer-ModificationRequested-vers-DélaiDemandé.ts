import { DélaiDemandé } from '@modules/demandeModification'
import { ModificationRequested } from '@modules/modificationRequest'
import { Op, QueryInterface, Sequelize } from 'sequelize'
import { toPersistance } from '../helpers'
import { models } from '../models'
import { ProjectEvent } from '../projectionsNext'
import onDélaiDemandé from '../projectionsNext/projectEvents/updates/onDélaiDemandé'

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { ModificationRequest, Project, EventStore } = models

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
              delayInMonths: { [Op.ne]: null },
            },
            attributes: ['id'],
          },
          { transaction }
        )

      console.log(`${demandesDélaiAMigrer.length} demandes de délai envoyées à migrer`)

      const nouveauxÉvénements = (
        await Promise.all(
          demandesDélaiAMigrer.map(async (demandeDélaiAMigrer) => {
            const modificationRequestedEvent:
              | (ModificationRequested & { payload: { type: 'delai' } })
              | undefined = await EventStore.findOne(
              {
                where: {
                  aggregateId: { [Op.overlap]: [demandeDélaiAMigrer.id] },
                  type: 'ModificationRequested',
                  'payload.type': { [Op.eq]: 'delai' },
                },
              },
              { transaction }
            )

            if (modificationRequestedEvent) {
              const { payload, occurredAt } = modificationRequestedEvent

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
          })
        )
      ).filter((e): e is DélaiDemandé => e?.type === 'DélaiDemandé')

      console.log(`${nouveauxÉvénements.length} nouveaux événements DélaiDemandé vont être ajoutés`)

      await EventStore.bulkCreate(nouveauxÉvénements.map(toPersistance), { transaction })

      await Promise.all(
        nouveauxÉvénements.map((délaiDemandé) => onDélaiDemandé(délaiDemandé, transaction))
      )

      const modificationRequestIds = nouveauxÉvénements.map((dd) => dd.payload.demandeDélaiId)
      await ProjectEvent.destroy({
        where: {
          type: 'ModificationRequested',
          'payload.modificationRequestId': {
            [Op.in]: modificationRequestIds,
          },
        },
        transaction,
      })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  down: async (queryInterface, Sequelize) => {},
}
