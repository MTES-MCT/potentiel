import { ChangementDePuissanceDemandé } from '@modules/demandeModification'
import { ModificationRequested } from '@modules/modificationRequest'
import { Op, QueryInterface } from 'sequelize'
import { toPersistance } from '../helpers'
import { models } from '../models'
import { ProjectEvent } from '../projectionsNext'
import onChangementDePuissanceDemandé from '../projectionsNext/projectEvents/updates/puissance/onChangementDePuissanceDemandé'

export default {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const { ModificationRequest, Project, EventStore } = models

      const demandesChangementDePuissanceAMigrer: Array<{
        id: string
        project: { completionDueOn: number }
      }> = await ModificationRequest.findAll({
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['completionDueOn'],
            required: true,
          },
        ],
        where: {
          type: 'puissance',
          status: ['envoyée', 'en instruction'],
        },
        attributes: ['id'],
        transaction,
      })

      console.log(
        `${demandesChangementDePuissanceAMigrer.length} demandes de changement de puissance envoyées à migrer`
      )

      const nouveauxÉvénements = (
        await Promise.all(
          demandesChangementDePuissanceAMigrer.map(async (demandeChangementDePuissance) => {
            const modificationRequestedEvent:
              | (ModificationRequested & { payload: { type: 'puissance' } })
              | undefined = await EventStore.findOne({
              where: {
                aggregateId: { [Op.overlap]: [demandeChangementDePuissance.id] },
                type: 'ModificationRequested',
                'payload.type': { [Op.eq]: 'puissance' },
              },
              transaction,
            })

            if (modificationRequestedEvent) {
              const { payload, occurredAt } = modificationRequestedEvent

              return new ChangementDePuissanceDemandé({
                payload: {
                  demandeChangementDePuissanceId: payload.modificationRequestId,
                  projetId: payload.projectId,
                  demandéPar: payload.requestedBy,
                  autorité: 'dreal',
                  fichierId: payload.fileId,
                  justification: payload.justification,
                  cahierDesCharges: payload.cahierDesCharges,
                  puissance: payload.puissance,
                  puissanceAuMomentDuDepot: payload.puissanceAuMomentDuDepot,
                },
                original: {
                  occurredAt,
                  version: 1,
                },
              })
            }
          })
        )
      ).filter((e): e is ChangementDePuissanceDemandé => e?.type === 'ChangementDePuissanceDemandé')

      console.log(
        `${nouveauxÉvénements.length} nouveaux événements ChangementDePuissanceDemandé vont être ajoutés`
      )

      await EventStore.bulkCreate(nouveauxÉvénements.map(toPersistance), { transaction })

      await Promise.all(
        nouveauxÉvénements.map((ChangementDePuissanceDemandé) =>
          onChangementDePuissanceDemandé(ChangementDePuissanceDemandé, transaction)
        )
      )

      const modificationRequestIds = nouveauxÉvénements.map(
        ({ payload: { demandeChangementDePuissanceId } }) => demandeChangementDePuissanceId
      )
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
