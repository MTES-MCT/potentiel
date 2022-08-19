import { logger } from '@core/utils'
import { RejetDemandeDélaiAnnulé } from '@modules/demandeModification'
import models from '../../../models'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  RejetDemandeDélaiAnnulé,
  async ({ payload }, transaction) => {
    const { demandeDélaiId } = payload

    // recherche d'un événement de type DemandeDélai associé à la demande
    const demandeDélaiInstance = await ProjectEvent.findOne({
      where: { id: demandeDélaiId, type: 'DemandeDélai' },
      transaction,
    })

    if (demandeDélaiInstance) {
      const { ModificationRequest } = models

      const rawRequestedOn = await ModificationRequest.findOne({
        attributes: ['requestedOn'],
        where: { id: demandeDélaiId },
        transaction,
      })

      if (!rawRequestedOn) {
        logger.error(
          new Error(
            `Erreur: impossible de trouver la modificationRequest (id = ${demandeDélaiId}) depuis onRejetDemandeDélaiAnnulé)`
          )
        )
      }

      Object.assign(demandeDélaiInstance, {
        valueDate: rawRequestedOn.requestedOn,
        eventPublishedAt: rawRequestedOn.requestedOn,
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
          type: 'ModificationRequestRejected',
          payload: { modificationRequestId: demandeDélaiId },
        },
        transaction,
      })
    } catch (e) {
      logger.error(e)
      logger.info(
        `Error: onRejetDemandeDélaiAnnulé n'a pas supprimer l'événement de type
        "ModificationRequestRejected" pour la demande id ${demandeDélaiId}.`
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
