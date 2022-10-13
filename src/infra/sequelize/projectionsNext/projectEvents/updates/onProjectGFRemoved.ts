import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'
import { ProjectGFRemoved } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancièresEvent } from '../events/GarantiesFinancièresEvent'

export default ProjectEventProjector.on(ProjectGFRemoved, async (évènement, transaction) => {
  const {
    payload: { projectId },
    occurredAt,
  } = évènement

  try {
    const projectEvent = (await ProjectEvent.findOne({
      where: { type: 'GarantiesFinancières', projectId },
      transaction,
    })) as GarantiesFinancièresEvent | undefined

    if (!projectEvent) {
      logger.error(
        new ProjectionEnEchec(`Erreur lors du traitement de l'événement ProjectGFRemoved`, {
          évènement,
          nomProjection: 'ProjectEvent.onProjectGFRemoved',
        })
      )
      return
    }

    await ProjectEvent.update(
      {
        eventPublishedAt: occurredAt.getTime(),
        payload: {
          statut: 'due',
          dateLimiteDEnvoi: projectEvent.payload.dateLimiteDEnvoi,
        },
      },
      {
        where: { type: 'GarantiesFinancières', projectId },
        transaction,
      }
    )
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
