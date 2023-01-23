import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { AnnulationAbandonAccordée } from '../../../../../../modules/demandeModification'
import { ProjectionEnEchec } from '@modules/shared'
import { logger } from '@core/utils'

export default ProjectEventProjector.on(
  AnnulationAbandonAccordée,
  async (évènement, transaction) => {
    const {
      payload: { demandeId },
      occurredAt,
    } = évènement

    const projectEvent = await ProjectEvent.findOne({
      where: { id: demandeId },
      transaction,
    })

    if (!projectEvent) {
      logger.error(
        new ProjectionEnEchec(`L'événement de la demande n'a pas été retrouvé`, {
          évènement,
          nomProjection: 'ProjectEventProjector.onAnnulationAbandonAccordée',
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
            ...projectEvent.payload,
            statut: 'accordée',
          },
        },
        { where: { id: demandeId }, transaction }
      )
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement AnnulationAbandonAccordée`,
          {
            évènement,
            nomProjection: 'ProjectEventProjector.onAnnulationAbandonAccordée',
          },
          e
        )
      )
    }
  }
)
