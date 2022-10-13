import { ProjectStepStatusUpdated } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { models } from '../../../../models'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '../../../../../../modules/shared'
import {
  GarantiesFinancièreEventPayload,
  GarantiesFinancièresEvent,
} from '../../events/GarantiesFinancièresEvent'
import { typeCheck } from '../../guards/typeCheck'

export default ProjectEventProjector.on(
  ProjectStepStatusUpdated,
  async (évènement, transaction) => {
    const {
      payload: { newStatus, projectStepId },
      occurredAt,
    } = évènement

    const { ProjectStep } = models
    const projectStep = await ProjectStep.findOne({
      attributes: ['projectId', 'type'],
      where: { id: projectStepId },
      transaction,
    })

    if (!projectStep) {
      logger.error(
        `Error: onProjectStepStatusUpdated projection failed to retrieve project step from db ProjectStep`
      )
      return
    }
    if (projectStep.type !== 'garantie-financiere') return
    if (newStatus !== 'validé' && newStatus !== 'à traiter') return

    try {
      const projectEvent = (await ProjectEvent.findOne({
        where: {
          type: 'GarantiesFinancières',
          projectId: projectStep.projectId,
        },
        transaction,
      })) as GarantiesFinancièresEvent

      if (
        projectEvent.payload.statut !== 'pending-validation' &&
        projectEvent.payload.statut !== 'validated'
      ) {
        return
      }

      await ProjectEvent.update(
        {
          valueDate: occurredAt.getTime(),
          eventPublishedAt: occurredAt.getTime(),
          payload: typeCheck<GarantiesFinancièreEventPayload>({
            ...projectEvent.payload,
            statut: newStatus === 'validé' ? 'validated' : 'pending-validation',
          }),
        },
        {
          where: {
            type: 'GarantiesFinancières',
            projectId: projectStep.projectId,
          },
          transaction,
        }
      )
    } catch (e) {
      logger.error(
        new ProjectionEnEchec(
          `Erreur lors du traitement de l'événement ProjectStepStatusUpdated`,
          {
            évènement,
            nomProjection: 'ProjectEvent.onProjectStepStatusUpdated',
          },
          e
        )
      )
    }
  }
)
