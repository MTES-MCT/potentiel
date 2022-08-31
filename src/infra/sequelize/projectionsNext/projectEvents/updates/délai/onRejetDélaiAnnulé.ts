import { logger } from '@core/utils'
import { RejetDélaiAnnulé } from '@modules/demandeModification'
import { ProjectionEnEchec } from '@modules/shared'
import models from '../../../../models'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'

export default ProjectEventProjector.on(RejetDélaiAnnulé, async (évènement, transaction) => {
  const {
    payload: { demandeDélaiId },
  } = évènement

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
        new ProjectionEnEchec(
          `Impossible de trouver la modificationRequest depuis onRejetDemandeDélaiAnnulé`,
          {
            evenement: évènement,
            nomProjection: 'ProjectEvent.onRejetDélaiAnnulé',
          }
        )
      )
      return
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
      logger.error(
        new ProjectionEnEchec(
          `Impossible d'enregistrer la mise à jour de la demande depuis onRejetDemandeDélaiAnnulé`,
          {
            evenement: évènement,
            nomProjection: 'ProjectEvent.onRejetDélaiAnnulé',
          },
          e
        )
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
    logger.error(
      new ProjectionEnEchec(
        `Impossible de supprimer l'évènement de type "ModificationRequestRejected" depuis onRejetDemandeDélaiAnnulé`,
        {
          evenement: évènement,
          nomProjection: 'ProjectEvent.onRejetDélaiAnnulé',
        },
        e
      )
    )
    return
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
    logger.error(
      new ProjectionEnEchec(
        `Impossible de supprimer l'évènement de type "ModificationRequestInstructionStarted" depuis onRejetDemandeDélaiAnnulé`,
        {
          evenement: évènement,
          nomProjection: 'ProjectEvent.onRejetDélaiAnnulé',
        },
        e
      )
    )
  }
})
