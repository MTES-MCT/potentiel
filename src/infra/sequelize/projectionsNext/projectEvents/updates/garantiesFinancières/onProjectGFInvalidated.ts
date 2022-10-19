import { ProjectGFInvalidated } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancièreEventPayload } from '../../events/GarantiesFinancièresEvent'
import { is } from '../../guards'

export default ProjectEventProjector.on(ProjectGFInvalidated, async (évènement, transaction) => {
  const {
    payload: { projectId },
    occurredAt,
  } = évènement

  try {
    const projectEvent = await ProjectEvent.findOne({
      where: { type: 'GarantiesFinancières', projectId },
      transaction,
    })

    if (!projectEvent || !is('GarantiesFinancières')(projectEvent)) {
      logger.error(
        new ProjectionEnEchec(`Erreur lors du traitement de l'événement ProjectGFInvalidated`, {
          évènement,
          nomProjection: 'ProjectEvent.onProjectGFInvalidated',
        })
      )
      return
    }

    const dateLimiteDEnvoi = projectEvent.payload.dateLimiteDEnvoi

    if (dateLimiteDEnvoi) {
      const payload: GarantiesFinancièreEventPayload = {
        statut: 'due',
        dateLimiteDEnvoi,
      }
      await ProjectEvent.update(
        {
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          payload,
        },
        {
          where: { type: 'GarantiesFinancières', projectId },
          transaction,
        }
      )
    } else {
      logger.error(
        new ProjectionEnEchec(`La date limite d'envoi est manquante pour ce ProjetEvent`, {
          évènement,
          nomProjection: 'ProjectEvent.onProjectGFInvalidated',
        })
      )
    }
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement ProjectGFInvalidated`,
        {
          évènement,
          nomProjection: 'ProjectEvent.onProjectGFInvalidated',
        },
        e
      )
    )
  }
})
