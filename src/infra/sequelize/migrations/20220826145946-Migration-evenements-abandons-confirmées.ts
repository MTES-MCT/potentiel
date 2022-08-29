import { AbandonConfirmé } from '@modules/demandeModification/demandeAbandon'
import { ModificationRequestConfirmed } from '@modules/modificationRequest'
import { Op, QueryInterface, Sequelize } from 'sequelize'
import { toPersistance } from '../helpers'
import { models } from '../models'
import { ProjectEvent } from '../projectionsNext'
import onAbandonConfirmé from '../projectionsNext/projectEvents/updates/abandon/onAbandonConfirmé'

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
            status: ['demande confirmée'],
          },
          attributes: ['id', 'projectId'],
        },
        { transaction }
      )

      console.log(`${demandesAbandonAMigrer.length} demandes d'abandon confirmées à migrer`)

      const nouveauxÉvénements = (
        await Promise.all(
          demandesAbandonAMigrer.map(async (demandesAbandonAMigrer) => {
            const modificationRequestConfirmedEvent: ModificationRequestConfirmed | undefined =
              await EventStore.findOne(
                {
                  where: {
                    aggregateId: { [Op.overlap]: [demandesAbandonAMigrer.id] },
                    type: 'ModificationRequestConfirmed',
                  },
                },
                { transaction }
              )

            if (modificationRequestConfirmedEvent) {
              const { occurredAt, payload } = modificationRequestConfirmedEvent

              return new AbandonConfirmé({
                payload: {
                  demandeAbandonId: demandesAbandonAMigrer.id,
                  projetId: demandesAbandonAMigrer.projectId,
                  confirméPar: payload.confirmedBy,
                },
                original: {
                  occurredAt,
                  version: 1,
                },
              })
            }
          })
        )
      ).filter((e): e is AbandonConfirmé => e?.type === 'AbandonConfirmé')

      console.log(
        `${nouveauxÉvénements.length} nouveaux événements AbandonConfirmé vont être ajoutés`
      )

      await EventStore.bulkCreate(nouveauxÉvénements.map(toPersistance), { transaction })

      await Promise.all(
        nouveauxÉvénements.map((AbandonConfirmé) => onAbandonConfirmé(AbandonConfirmé, transaction))
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
