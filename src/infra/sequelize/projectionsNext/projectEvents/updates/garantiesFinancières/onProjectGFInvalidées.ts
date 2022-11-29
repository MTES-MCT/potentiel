import { ProjectGFValidées } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '../../../../../../modules/shared'
import { GarantiesFinancièreEventPayload } from '../../events/GarantiesFinancièresEvent'
import { is } from '../../guards'

export default ProjectEventProjector.on(ProjectGFValidées, async (évènement, transaction) => {
  const {
    payload: { projetId },
    occurredAt,
  } = évènement

  try {
    const projectEvent = await ProjectEvent.findOne({
      where: {
        type: 'GarantiesFinancières',
        projectId: projetId,
      },
      transaction,
    })

    if (!projectEvent || !is('GarantiesFinancières')(projectEvent)) {
      logger.error(
        new ProjectionEnEchec(`Erreur lors du traitement de l'événement ProjectGFValidées`, {
          évènement,
          nomProjection: 'ProjectEvent.onProjectGFValidées',
        })
      )
      return
    }

    if (projectEvent.payload.statut !== 'validated') {
      return
    }

    const payload: GarantiesFinancièreEventPayload = {
      ...projectEvent.payload,
      statut: 'pending-validation',
    }
    await ProjectEvent.update(
      {
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload,
      },
      {
        where: {
          type: 'GarantiesFinancières',
          projectId: projetId,
        },
        transaction,
      }
    )
  } catch (e) {
    logger.error(
      new ProjectionEnEchec(
        `Erreur lors du traitement de l'événement ProjectGFValidées`,
        {
          évènement,
          nomProjection: 'ProjectEvent.onProjectGFValidées',
        },
        e
      )
    )
  }
})
