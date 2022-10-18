import { DateEchéanceGFAjoutée } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancièreEventPayload } from '../../events/GarantiesFinancièresEvent'
import { is } from '../../guards'

export default ProjectEventProjector.on(DateEchéanceGFAjoutée, async (évènement, transaction) => {
  const {
    payload: { expirationDate, projectId },
  } = évènement

  try {
    const projectEvent = await ProjectEvent.findOne({
      where: { type: 'GarantiesFinancières', projectId },
      transaction,
    })

    if (!projectEvent || !is('GarantiesFinancières')(projectEvent)) {
      logger.error(
        new ProjectionEnEchec(`Erreur lors du traitement de l'événement DateEchéanceGFAjoutée`, {
          évènement,
          nomProjection: 'ProjectEvent.onDateEchéanceGFAjoutée',
        })
      )
      return
    }

    const payload: GarantiesFinancièreEventPayload = {
      ...projectEvent.payload,
      ...(expirationDate && { dateExpiration: expirationDate.getTime() }),
    }
    await ProjectEvent.update(
      { payload },
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
