import { logger } from '@core/utils'
import { AccordDemandeDélaiAnnulé } from '@modules/demandeModification'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  AccordDemandeDélaiAnnulé,
  async ({ payload, occurredAt }, transaction) => {
    const { demandeDélaiId } = payload

    // recherche d'un événement de type DemandeDélai associé à la demande
    const demandeDélaiInstance = await ProjectEvent.findOne({
      where: { id: demandeDélaiId, type: 'DemandeDélai' },
      transaction,
    })

    if (demandeDélaiInstance) {
      Object.assign(demandeDélaiInstance, {
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: {
          // @ts-ignore
          ...demandeDélaiInstance.payload,
          statut: 'envoyée',
          rejetéPar: null,
        },
      })

      try {
        await demandeDélaiInstance.save({ transaction })
      } catch (e) {
        logger.error(e)
        logger.info(
          `Error: onRejetDemandeDélaiAnnulé n'a pas pu enregistrer la mise à jour de la demande ref ${demandeDélaiId}.`
        )
      }
      return
    }

    // Si pas d'événement de type DemandeDélai
    // Recherche d'un événement de type ModificationRequest associé à la demande
    try {
      await ProjectEvent.destroy({
        where: {
          type: 'ModificationRequestAccepted',
          payload: { modificationRequestId: demandeDélaiId },
        },
        transaction,
      })
    } catch (e) {
      logger.error(e)
      logger.info(
        `Error: onRejetDemandeDélaiAnnulé n'a pas supprimer l'événement de type
        "ModificationRequestAccepted" pour la demande id ${demandeDélaiId}.`
      )
    }

    try {
      await ProjectEvent.destroy({
        where: {
          type: 'ModificationRequestInstructionStarted',
          payload: { modificationRequestId: demandeDélaiId },
        },
        transaction,
      })
    } catch (e) {
      logger.error(e)
      logger.info(
        `Error: onRejetDemandeDélaiAnnulé n'a pas supprimer l'événement de type
        "ModificationRequestInstructionStarted" pour la demande id ${demandeDélaiId}.`
      )
    }

    return
  }
)
