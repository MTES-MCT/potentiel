import { ProjectStepStatusUpdated } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'
import { models } from '../../../models'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '../../../../../modules/shared'
import { GarantiesFinancièresEvent } from '../events/GarantiesFinancièresEvent'

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

    const type = projectStep.type

    if (type !== 'garantie-financiere' || (newStatus !== 'validé' && newStatus !== 'à traiter')) {
      return
    }

    try {
      const projectEvent = (await ProjectEvent.findOne({
        where: {
          type: 'GarantiesFinancières',
          projectId: projectStep.projectId,
        },
        transaction,
      })) as GarantiesFinancièresEvent

      await ProjectEvent.update(
        {
          payload: {
            ...projectEvent.payload,
            statut: newStatus === 'validé' ? 'validated' : 'pending-validation',
          },
          eventPublishedAt: occurredAt.getTime(),
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
