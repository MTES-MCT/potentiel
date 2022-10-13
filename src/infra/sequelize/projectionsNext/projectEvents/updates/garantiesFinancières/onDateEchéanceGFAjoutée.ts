import { DateEchéanceGFAjoutée } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import {
  GarantiesFinancièreEventPayload,
  GarantiesFinancièresEvent,
} from '../../events/GarantiesFinancièresEvent'
import { typeCheck } from '../../guards/typeCheck'

export default ProjectEventProjector.on(DateEchéanceGFAjoutée, async (évènement, transaction) => {
  const {
    occurredAt,
    payload: { expirationDate, projectId },
  } = évènement

  try {
    const projectEvent = (await ProjectEvent.findOne({
      where: { type: 'GarantiesFinancières', projectId },
      transaction,
    })) as GarantiesFinancièresEvent | undefined

    if (!projectEvent) {
      logger.error(
        new ProjectionEnEchec(`Erreur lors du traitement de l'événement DateEchéanceGFAjoutée`, {
          évènement,
          nomProjection: 'ProjectEvent.onDateEchéanceGFAjoutée',
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
          ...(expirationDate && { dateExpiration: expirationDate.getTime() }),
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
        `Erreur lors du traitement de l'événement DateEchéanceGFAjoutée`,
        {
          évènement,
          nomProjection: 'ProjectEvent.onDateEchéanceGFAjoutée',
        },
        e
      )
    )
  }
})
