import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { AbandonAccordé } from '../../../../../../modules/demandeModification'
import { ProjectionEnEchec } from '@modules/shared'
import { logger } from '@core/utils'

export default ProjectEventProjector.on(AbandonAccordé, async (évènement, transaction) => {
  const {
    payload: { demandeAbandonId },
    occurredAt,
  } = évènement

  const abandonEvent = await ProjectEvent.findOne({ where: { id: demandeAbandonId }, transaction })

  if (!abandonEvent) {
    logger.error(
      new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
        évènement,
        nomProjection: 'ProjectEventProjector.onAbandonAccordé',
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
          statut: 'accordée',
        },
      },
      { where: { id: demandeAbandonId }, transaction }
    )
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement AbandonAccordé`,
        {
          évènement,
          nomProjection: 'ProjectEventProjector.onAbandonAccordé',
        },
        e
      )
    )
  }
})
