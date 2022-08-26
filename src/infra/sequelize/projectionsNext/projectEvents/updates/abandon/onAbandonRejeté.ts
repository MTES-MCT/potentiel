import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { AbandonRejeté } from '../../../../../../modules/demandeModification'
import { ProjectionEnEchec } from '@modules/shared'
import { logger } from '@core/utils'

export default ProjectEventProjector.on(AbandonRejeté, async (événement, transaction) => {
  const {
    payload: { demandeAbandonId },
    occurredAt,
  } = événement

  const abandonEvent = await ProjectEvent.findOne({ where: { id: demandeAbandonId }, transaction })

  if (!abandonEvent) {
    logger.error(
      new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
        evenement: événement,
        nomProjection: 'ProjectEventProjector.onAbandonRejeté',
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
          statut: 'rejetée',
        },
      },
      { where: { id: demandeAbandonId }, transaction }
    )
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement AbandonRejeté`,
        {
          evenement: événement,
          nomProjection: 'ProjectEventProjector.onAbandonRejeté',
        },
        e
      )
    )
  }
})
