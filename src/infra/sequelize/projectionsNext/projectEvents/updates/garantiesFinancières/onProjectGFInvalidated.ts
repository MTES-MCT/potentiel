import { ProjectGFInvalidated } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import {
  GarantiesFinancièresEvent,
  GarantiesFinancièreEventPayload,
} from '../../events/GarantiesFinancièresEvent'
import { typeCheck } from '../../guards/typeCheck'

export default ProjectEventProjector.on(ProjectGFInvalidated, async (évènement, transaction) => {
  const {
    payload: { projectId },
    occurredAt,
  } = évènement

  try {
    const projectEvent = (await ProjectEvent.findOne({
      where: { type: 'GarantiesFinancières', projectId },
      transaction,
    })) as GarantiesFinancièresEvent | undefined

    if (!projectEvent || projectEvent.payload.statut !== 'validated') {
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
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: typeCheck<GarantiesFinancièreEventPayload>({
          ...projectEvent.payload,
          statut: 'pending-validation',
        }),
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
