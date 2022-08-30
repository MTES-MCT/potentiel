import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { AbandonAnnulé } from '../../../../../../modules/demandeModification'
import { ProjectionEnEchec } from '@modules/shared'
import { logger } from '@core/utils'

export default ProjectEventProjector.on(AbandonAnnulé, async (événement, transaction) => {
  const {
    payload: { demandeAbandonId },
    occurredAt,
  } = événement

  const abandonEvent = await ProjectEvent.findOne({ where: { id: demandeAbandonId }, transaction })

  if (!abandonEvent) {
    logger.error(
      new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
        evenement: événement,
        nomProjection: 'ProjectEventProjector.onAbandonAnnulé',
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
          statut: 'annulée',
        },
      },
      { where: { id: demandeAbandonId }, transaction }
    )
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement AbandonAnnulé`,
        {
          evenement: événement,
          nomProjection: 'ProjectEventProjector.onAbandonAnnulé',
        },
        e
      )
    )
  }
})
