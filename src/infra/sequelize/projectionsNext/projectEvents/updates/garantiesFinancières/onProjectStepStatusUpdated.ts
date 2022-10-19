import { ProjectStepStatusUpdated } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../../projectEvent.model'
import { models } from '../../../../models'
import { logger } from '@core/utils'
import { ProjectionEnEchec } from '../../../../../../modules/shared'
import { GarantiesFinancièreEventPayload } from '../../events/GarantiesFinancièresEvent'
import { is } from '../../guards'

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
      const projectEvent = await ProjectEvent.findOne({
        where: {
          type: 'GarantiesFinancières',
          projectId: projectStep.projectId,
        },
        transaction,
      })

      if (!projectEvent || !is('GarantiesFinancières')(projectEvent)) {
        logger.error(
          new ProjectionEnEchec(
            `Erreur lors du traitement de l'événement ProjectStepStatusUpdated`,
            {
              évènement,
              nomProjection: 'ProjectEvent.onProjectStepStatusUpdated',
            }
          )
        )
        return
      }

      if (
        projectEvent.payload.statut !== 'pending-validation' &&
        projectEvent.payload.statut !== 'validated'
      ) {
        return
      }

      const payload: GarantiesFinancièreEventPayload = {
        ...projectEvent.payload,
        statut: newStatus === 'validé' ? 'validated' : 'pending-validation',
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
