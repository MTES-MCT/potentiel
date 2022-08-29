import { AbandonDemandé } from '@modules/demandeModification'
import { ModificationRequested } from '@modules/modificationRequest'
import { Op, QueryInterface, Sequelize } from 'sequelize'
import { toPersistance } from '../helpers'
import { models } from '../models'
import { ProjectEvent } from '../projectionsNext'
import onAbandonDemandé from '../projectionsNext/projectEvents/updates/abandon/onAbandonDemandé'

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { ModificationRequest, EventStore } = models

      const demandesAbandonAMigrer: Array<{ id: string }> = await ModificationRequest.findAll(
        {
          where: {
            type: 'abandon',
            status: ['envoyée', 'en instruction'],
          },
          attributes: ['id'],
        },
        { transaction }
      )

      console.log(`${demandesAbandonAMigrer.length} demandes d'abandon envoyées à migrer`)

      const nouveauxÉvénements = (
        await Promise.all(
          demandesAbandonAMigrer.map(async (demandeAbandonAMigrer) => {
            const modificationRequestedEvent:
              | (ModificationRequested & { payload: { type: 'abandon' } })
              | undefined = await EventStore.findOne(
              {
                where: {
                  aggregateId: { [Op.overlap]: [demandeAbandonAMigrer.id] },
                  type: 'ModificationRequested',
                  'payload.type': { [Op.eq]: 'abandon' },
                },
              },
              { transaction }
            )

            if (modificationRequestedEvent) {
              const { payload, occurredAt } = modificationRequestedEvent

              return new AbandonDemandé({
                payload: {
                  demandeAbandonId: payload.modificationRequestId,
                  projetId: payload.projectId,
                  autorité: 'dgec',
                  fichierId: payload.fileId,
                  justification: payload.justification,
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
      ).filter((e): e is AbandonDemandé => e?.type === 'AbandonDemandé')

      console.log(
        `${nouveauxÉvénements.length} nouveaux événements AbandonDemandé vont être ajoutés`
      )

      await EventStore.bulkCreate(nouveauxÉvénements.map(toPersistance), { transaction })

      await Promise.all(
        nouveauxÉvénements.map((AbandonDemandé) => onAbandonDemandé(AbandonDemandé, transaction))
      )

      const modificationRequestIds = nouveauxÉvénements.map(
        (demande) => demande.payload.demandeAbandonId
      )

      await ProjectEvent.destroy({
        where: {
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
