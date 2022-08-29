import { AbandonAccordé } from '@modules/demandeModification/demandeAbandon'
import { ModificationRequestAccepted } from '@modules/modificationRequest'
import { Op, QueryInterface, Sequelize } from 'sequelize'
import { toPersistance } from '../helpers'
import { models } from '../models'
import { ProjectEvent } from '../projectionsNext'
import onAbandonAccordé from '../projectionsNext/projectEvents/updates/abandon/onAbandonAccordé'

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
            status: ['acceptée'],
            isLegacy: { [Op.not]: true },
          },
          attributes: ['id', 'projectId'],
        },
        { transaction }
      )

      console.log(`${demandesAbandonAMigrer.length} demandes d'abandon accordées à migrer`)

      const nouveauxÉvénements = (
        await Promise.all(
          demandesAbandonAMigrer.map(async (demandesAbandonAMigrer) => {
            const modificationRequestAcceptedEvent: ModificationRequestAccepted | undefined =
              await EventStore.findOne(
                {
                  where: {
                    aggregateId: { [Op.overlap]: [demandesAbandonAMigrer.id] },
                    type: 'ModificationRequestAccepted',
                  },
                },
                { transaction }
              )

            if (modificationRequestAcceptedEvent) {
              const { occurredAt, payload } = modificationRequestAcceptedEvent

              return new AbandonAccordé({
                payload: {
                  demandeAbandonId: demandesAbandonAMigrer.id,
                  projetId: demandesAbandonAMigrer.projectId,
                  accordéPar: payload.acceptedBy,
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
      ).filter((e): e is AbandonAccordé => e?.type === 'AbandonAccordé')

      console.log(
        `${nouveauxÉvénements.length} nouveaux événements AbandonAccordé vont être ajoutés`
      )

      await EventStore.bulkCreate(nouveauxÉvénements.map(toPersistance), { transaction })

      await Promise.all(
        nouveauxÉvénements.map((AbandonAccordé) => onAbandonAccordé(AbandonAccordé, transaction))
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
