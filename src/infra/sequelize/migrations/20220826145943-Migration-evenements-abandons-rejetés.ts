import { AbandonRejeté } from '@modules/demandeModification'
import { ModificationRequested, ModificationRequestRejected } from '@modules/modificationRequest'
import { Op, QueryInterface, Sequelize } from 'sequelize'
import { toPersistance } from '../helpers'
import { models } from '../models'
import { ProjectEvent } from '../projectionsNext'
import onAbandonRejeté from '../projectionsNext/projectEvents/updates/abandon/onAbandonRejeté'

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { ModificationRequest, EventStore } = models

      const demandesAbandonAMigrer: Array<{
        id: string
        responseFileId: string
        respondedBy: string
        projectId: string
      }> = await ModificationRequest.findAll(
        {
          where: {
            type: 'abandon',
            status: ['rejetée'],
          },
          attributes: ['id', 'responseFileId', 'respondedBy', 'projectId'],
        },
        { transaction }
      )

      console.log(`${demandesAbandonAMigrer.length} demandes d'abandon rejetées à migrer`)

      const nouveauxÉvénements = (
        await Promise.all(
          demandesAbandonAMigrer.map(async (demandesAbandonAMigrer) => {
            const modificationRequestRejectedEvent: ModificationRequestRejected | undefined =
              await EventStore.findOne(
                {
                  where: {
                    aggregateId: { [Op.overlap]: [demandesAbandonAMigrer.id] },
                    type: 'ModificationRequestRejected',
                  },
                },
                { transaction }
              )

            if (modificationRequestRejectedEvent) {
              const { occurredAt } = modificationRequestRejectedEvent

              return new AbandonRejeté({
                payload: {
                  demandeAbandonId: demandesAbandonAMigrer.id,
                  projetId: demandesAbandonAMigrer.projectId,
                  rejetéPar: demandesAbandonAMigrer.respondedBy,
                  fichierRéponseId: demandesAbandonAMigrer.responseFileId,
                },
                original: {
                  occurredAt,
                  version: 1,
                },
              })
            }
          })
        )
      ).filter((e): e is AbandonRejeté => e?.type === 'AbandonRejeté')

      console.log(
        `${nouveauxÉvénements.length} nouveaux événements AbandonRejeté vont être ajoutés`
      )

      await EventStore.bulkCreate(nouveauxÉvénements.map(toPersistance), { transaction })

      await Promise.all(
        nouveauxÉvénements.map((AbandonRejeté) => onAbandonRejeté(AbandonRejeté, transaction))
      )

      const modificationRequestIds = nouveauxÉvénements.map(
        (demande) => demande.payload.demandeAbandonId
      )

      await ProjectEvent.destroy({
        where: {
          type: {
            [Op.in]: [
              'ModificationRequested',
              'ModificationRequestInstructionStarted',
              'ModificationRequestRejected',
            ],
          },
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
