import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { ProjectGFWithdrawn } from '@modules/project'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '@modules/shared'
import { GarantiesFinancièresEvent } from '../../events/GarantiesFinancièresEvent'

export default ProjectEventProjector.on(ProjectGFWithdrawn, async (évènement, transaction) => {
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
        new ProjectionEnEchec(`Erreur lors du traitement de l'événement ProjectGFWithdrawn`, {
          évènement,
          nomProjection: 'ProjectEvent.onProjectGFWithdrawn',
        })
      )
      return
    }

    if (projectEvent?.payload.dateLimiteDEnvoi) {
      await ProjectEvent.update(
        {
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          payload: { statut: 'due', dateLimiteDEnvoi: projectEvent?.payload.dateLimiteDEnvoi },
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
        `Erreur lors du traitement de l'événement ProjectGFWithdrawn`,
        {
          évènement,
          nomProjection: 'ProjectEvent.onProjectGFWithdrawn',
        },
        e
      )
    )
  }
})
