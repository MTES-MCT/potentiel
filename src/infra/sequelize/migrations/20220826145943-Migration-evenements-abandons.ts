import {
  AbandonAccordé,
  AbandonAnnulé,
  AbandonConfirmé,
  AbandonDemandé,
  AbandonRejeté,
  ConfirmationAbandonDemandée,
} from '@modules/demandeModification'
import { Op, QueryInterface, Sequelize } from 'sequelize'
import { toPersistance } from '../helpers'
import { models } from '../models'
import { ProjectEvent } from '../projectionsNext'
import onAbandonAccordé from '../projectionsNext/projectEvents/updates/abandon/onAbandonAccordé'
import onAbandonAnnulé from '../projectionsNext/projectEvents/updates/abandon/onAbandonAnnulé'
import onAbandonConfirmé from '../projectionsNext/projectEvents/updates/abandon/onAbandonConfirmé'
import onAbandonDemandé from '../projectionsNext/projectEvents/updates/abandon/onAbandonDemandé'
import onAbandonRejeté from '../projectionsNext/projectEvents/updates/abandon/onAbandonRejeté'
import onConfirmationAbandonDemandée from '../projectionsNext/projectEvents/updates/abandon/onConfirmationAbandonDemandée'

export default {
  up: async (queryInterface: QueryInterface, Sequelize: Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      console.log('TEST')
      const { ModificationRequest, EventStore } = models

      const eventsAbandonAMigrer: Array<{ id: string; projectId: string }> =
        await ModificationRequest.findAll(
          {
            where: {
              type: 'abandon',
              isLegacy: { [Op.not]: true },
            },
            attributes: ['id', 'projectId'],
          },
          { transaction }
        )

      console.log(`${eventsAbandonAMigrer.length} demandes d'abandon à migrer`)

      const nouveauxÉvénements = (
        await Promise.all(
          eventsAbandonAMigrer.map(async (demandesAbandonAMigrer) => {
            const { id, projectId } = demandesAbandonAMigrer
            const eventsACopier = await EventStore.findAll(
              {
                where: {
                  aggregateId: { [Op.overlap]: [demandesAbandonAMigrer.id] },
                },
              },
              { transaction }
            )

            return eventsACopier.map((event) => {
              const { payload, occurredAt } = event
              switch (event.type) {
                case 'ModificationRequested':
                  return new AbandonDemandé({
                    payload: {
                      demandeAbandonId: id,
                      projetId: projectId,
                      autorité: 'dgec',
                      porteurId: payload.requestedBy,
                      ...(payload.justification && { justification: payload.justification }),
                      ...(payload.fileId && { fichierId: payload.fileId }),
                    },
                    original: {
                      occurredAt,
                      version: 1,
                    },
                  })
                case 'ModificationRequestCancelled':
                  return new AbandonAnnulé({
                    payload: {
                      demandeAbandonId: id,
                      projetId: projectId,
                      annuléPar: payload.cancelledBy,
                    },
                    original: {
                      occurredAt,
                      version: 1,
                    },
                  })
                case 'ModificationRequestAccepted':
                  return new AbandonAccordé({
                    payload: {
                      demandeAbandonId: id,
                      projetId: projectId,
                      accordéPar: payload.acceptedBy,
                      fichierRéponseId: payload.responseFileId,
                    },
                    original: {
                      occurredAt,
                      version: 1,
                    },
                  })
                case 'ModificationRequestRejected':
                  return new AbandonRejeté({
                    payload: {
                      demandeAbandonId: id,
                      projetId: projectId,
                      rejetéPar: payload.rejectedBy,
                      fichierRéponseId: payload.responseFileId,
                    },
                    original: {
                      occurredAt,
                      version: 1,
                    },
                  })
                case 'ModificationRequestConfirmed':
                  return new AbandonConfirmé({
                    payload: {
                      demandeAbandonId: id,
                      projetId: projectId,
                      confirméPar: payload.confirmedBy,
                    },
                    original: {
                      occurredAt,
                      version: 1,
                    },
                  })
                case 'ConfirmationRequested':
                  return new ConfirmationAbandonDemandée({
                    payload: {
                      demandeAbandonId: id,
                      projetId: projectId,
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
          })
        )
      )
        .flat()
        .filter((e) => e !== undefined)
        .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime())

      console.log(
        `${nouveauxÉvénements.length} nouveaux événements vont être ajoutés à l'event store`
      )

      await EventStore.bulkCreate(nouveauxÉvénements.map(toPersistance), { transaction })

      for await (let événement of nouveauxÉvénements) {
        switch (événement.type) {
          case 'AbandonDemandé':
            onAbandonDemandé(événement, transaction)
            break
          case 'AbandonAnnulé':
            onAbandonAnnulé(événement, transaction)
            break
          case 'AbandonAccordé':
            onAbandonAccordé(événement, transaction)
            break
          case 'AbandonRejeté':
            onAbandonRejeté(événement, transaction)
            break
          case 'ConfirmationAbandonDemandée':
            onConfirmationAbandonDemandée(événement, transaction)
            break
          case 'AbandonConfirmé':
            onAbandonConfirmé(événement, transaction)
            break
        }
      }

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
