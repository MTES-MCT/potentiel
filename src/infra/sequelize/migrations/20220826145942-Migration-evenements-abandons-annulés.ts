import { AbandonAnnulé } from '@modules/demandeModification/demandeAbandon'
import { ModificationRequestCancelled } from '@modules/modificationRequest'
import { Op, QueryInterface, Sequelize } from 'sequelize'
import { toPersistance } from '../helpers'
import { models } from '../models'
import { ProjectEvent } from '../projectionsNext'
import onAbandonAnnulé from '../projectionsNext/projectEvents/updates/abandon/onAbandonAnnulé'

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { ModificationRequest, EventStore } = models

      const demandesAbandonAMigrer: Array<{ id: string; projectId: string }> =
        await ModificationRequest.findAll(
          {
            where: {
              type: 'abandon',
              status: ['annulée'],
            },
            attributes: ['id', 'projectId'],
          },
          { transaction }
        )

      console.log(`${demandesAbandonAMigrer.length} demandes d'abandon annulées à migrer`)

      const nouveauxÉvénements = (
        await Promise.all(
          demandesAbandonAMigrer.map(async (demandesAbandonAMigrer) => {
            const modificationRequestCancelledEvent: ModificationRequestCancelled | undefined =
              await EventStore.findOne(
                {
                  where: {
                    aggregateId: { [Op.overlap]: [demandesAbandonAMigrer.id] },
                    type: 'ModificationRequestCancelled',
                  },
                },
                { transaction }
              )

            if (modificationRequestCancelledEvent) {
              const { occurredAt, payload } = modificationRequestCancelledEvent

              return new AbandonAnnulé({
                payload: {
                  demandeAbandonId: demandesAbandonAMigrer.id,
                  projetId: demandesAbandonAMigrer.projectId,
                  annuléPar: payload.cancelledBy,
                },
                original: {
                  occurredAt,
                  version: 1,
                },
              })
            }
          })
        )
      ).filter((e): e is AbandonAnnulé => e?.type === 'AbandonAnnulé')

      console.log(
        `${nouveauxÉvénements.length} nouveaux événements AbandonAnnulé vont être ajoutés`
      )

      await EventStore.bulkCreate(nouveauxÉvénements.map(toPersistance), { transaction })

      await Promise.all(
        nouveauxÉvénements.map((AbandonAnnulé) => onAbandonAnnulé(AbandonAnnulé, transaction))
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
