import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { AbandonConfirmé } from '../../../../../../modules/demandeModification'
import { ProjectionEnEchec } from 'src/modules/shared'
import { logger } from 'src/core/utils'

export default ProjectEventProjector.on(AbandonConfirmé, async (événement, transaction) => {
  const {
    payload: { demandeAbandonId },
    occurredAt,
  } = événement

  const abandonEvent = await ProjectEvent.findOne({ where: { id: demandeAbandonId }, transaction })

  if (!abandonEvent) {
    logger.error(
      new ProjectionEnEchec(`L'événement pour la demande n'a pas été retrouvé`, {
        evenement: événement,
        nomProjection: 'ProjectEventProjector.onAbandonConfirmé',
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
          statut: 'demande confirmée',
        },
      },
      { where: { id: demandeAbandonId }, transaction }
    )
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement AbandonConfirmé`,
        {
          evenement: événement,
          nomProjection: 'ProjectEventProjector.onAbandonConfirmé',
        },
        e
      )
    )
  }
})
