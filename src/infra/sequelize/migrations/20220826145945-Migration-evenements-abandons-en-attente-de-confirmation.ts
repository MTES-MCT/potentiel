import { ConfirmationAbandonDemandée } from '@modules/demandeModification'
import { ConfirmationRequested } from '@modules/modificationRequest'
import { Op, QueryInterface, Sequelize } from 'sequelize'
import { toPersistance } from '../helpers'
import { models } from '../models'
import { ProjectEvent } from '../projectionsNext'
import onConfirmationAbandonDemandée from '../projectionsNext/projectEvents/updates/abandon/onConfirmationAbandonDemandée'

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { ModificationRequest, EventStore } = models

      const demandesAbandonAMigrer: Array<{
        id: string
        projectId: string
      }> = await ModificationRequest.findAll(
        {
          where: {
            type: 'abandon',
            status: ['en attente de confirmation'],
          },
          attributes: ['id', 'projectId'],
        },
        { transaction }
      )

      console.log(
        `${demandesAbandonAMigrer.length} demandes d'abandon en attente de confirmation à migrer`
      )

      const nouveauxÉvénements = (
        await Promise.all(
          demandesAbandonAMigrer.map(async (demandesAbandonAMigrer) => {
            const confirmationRequestedEvent: ConfirmationRequested | undefined =
              await EventStore.findOne(
                {
                  where: {
                    aggregateId: { [Op.overlap]: [demandesAbandonAMigrer.id] },
                    type: 'ConfirmationRequested',
                  },
                },
                { transaction }
              )

            if (confirmationRequestedEvent) {
              const { occurredAt, payload } = confirmationRequestedEvent

              return new ConfirmationAbandonDemandée({
                payload: {
                  demandeAbandonId: demandesAbandonAMigrer.id,
                  projetId: demandesAbandonAMigrer.projectId,
                  demandéePar: payload.confirmationRequestedBy,
                  fichierRéponseId: payload.responseFileId,
                },
                original: {
                  occurredAt,
                  version: 1,
                },
              })
            }
          })
        )
      ).filter((e): e is ConfirmationAbandonDemandée => e?.type === 'ConfirmationAbandonDemandée')

      console.log(
        `${nouveauxÉvénements.length} nouveaux événements ConfirmationAbandonDemandée vont être ajoutés`
      )

      await EventStore.bulkCreate(nouveauxÉvénements.map(toPersistance), { transaction })

      await Promise.all(
        nouveauxÉvénements.map((ConfirmationAbandonDemandée) =>
          onConfirmationAbandonDemandée(ConfirmationAbandonDemandée, transaction)
        )
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
