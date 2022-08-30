import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { ConfirmationAbandonDemandée } from '../../../../../../modules/demandeModification'
import { ProjectionEnEchec } from '@modules/shared'
import { logger } from '@core/utils'

export default ProjectEventProjector.on(
  ConfirmationAbandonDemandée,
  async (événement, transaction) => {
    const {
      payload: { demandeAbandonId },
      occurredAt,
    } = événement

    const abandonEvent = await ProjectEvent.findOne({
      where: { id: demandeAbandonId },
      transaction,
    })

    if (!abandonEvent) {
      logger.error(
        new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
          evenement: événement,
          nomProjection: 'ProjectEventProjector.onConfirmationAbandonDemandée',
        })
      )
      return
    }

    try {
      await ProjectEvent.update(
        {
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          payload: {
            ...abandonEvent.payload,
            statut: 'en attente de confirmation',
          },
        },
        { where: { id: demandeAbandonId }, transaction }
      )
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement ConfirmationAbandonDemandée`,
          {
            evenement: événement,
            nomProjection: 'ProjectEventProjector.onConfirmationAbandonDemandée',
          },
          e
        )
      )
    }
  }
)
