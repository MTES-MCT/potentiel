import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectStepStatusUpdated } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'
import { models } from '../../../models'

export default ProjectEvent.projector.on(
  ProjectStepStatusUpdated,
  async ({ payload: { newStatus, projectStepId }, occurredAt }, transaction) => {
    const { ProjectStep } = models
    const projectStep = await ProjectStep.findOne({
      attributes: ['projectId', 'type'],
      where: { id: projectStepId },
    })
    await ProjectEvent.create(
      {
        type: ProjectStepStatusUpdated.type,
        projectId: projectStep.projectId,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: { newStatus, type: projectStep.type },
        id: new UniqueEntityID().toString(),
      },
      { transaction }
    )
  }
)
