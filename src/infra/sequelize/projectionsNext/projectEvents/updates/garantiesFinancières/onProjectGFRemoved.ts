import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { ProjectGFRemoved } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancièreEventPayload } from '../../events/GarantiesFinancièresEvent'
import { is } from '../../guards'

export default ProjectEventProjector.on(ProjectGFRemoved, async (évènement, transaction) => {
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
        new ProjectionEnEchec(`Erreur lors du traitement de l'événement ProjectGFRemoved`, {
          évènement,
          nomProjection: 'ProjectEvent.onProjectGFRemoved',
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
      await ProjectEvent.destroy({
        where: { type: 'GarantiesFinancières', projectId },
        transaction,
      })
    }
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement ProjectGFRemoved`,
        {
          évènement,
          nomProjection: 'ProjectEvent.onProjectGFRemoved',
        },
        e
      )
    )
  }
})
