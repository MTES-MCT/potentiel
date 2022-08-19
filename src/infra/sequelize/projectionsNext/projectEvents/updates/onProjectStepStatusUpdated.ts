import { UniqueEntityID } from '@core/domain'
import { ProjectStepStatusUpdated } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'
import { models } from '../../../models'
import { logger } from '@core/utils'

export default ProjectEventProjector.on(
  ProjectStepStatusUpdated,
  async ({ payload: { newStatus, projectStepId }, occurredAt }, transaction) => {
    const { ProjectStep } = models
    const projectStep = await ProjectStep.findOne({
      attributes: ['projectId', 'type'],
      where: { id: projectStepId },
      transaction,
    })

    if (!ProjectStep) {
      logger.error(
        `Error: onProjectStepStatusUpdated projection failed to retrieve project step from db ProjectStep`
      )
      return
    }

    const type = projectStep.type
    const status = newStatus

    if (type !== 'garantie-financiere' || (status !== 'validé' && status !== 'à traiter')) {
      return
    }

    await ProjectEvent.create(
      {
        type: status === 'validé' ? 'ProjectGFValidated' : 'ProjectGFInvalidated',
        projectId: projectStep.projectId,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
      },
      { transaction }
    )
  }
)
