import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { ProjectGFRemoved } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancièresEvent } from '../../events/GarantiesFinancièresEvent'
import { typeCheck } from '../../guards/typeCheck'
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

    if (
      !projectEvent ||
      !is('GarantiesFinancières')(projectEvent) ||
      !projectEvent?.payload.dateLimiteDEnvoi
    ) {
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
        payload: typeCheck<GarantiesFinancièresEvent['payload']>({
          statut: 'due',
          dateLimiteDEnvoi: projectEvent.payload.dateLimiteDEnvoi,
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
