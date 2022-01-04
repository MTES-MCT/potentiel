import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectNotified } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectNotified,
  async ({ payload: { projectId, notifiedOn }, occurredAt }) => {
    await ProjectEvent.findOrCreate({
      where: {
        projectId,
        type: ProjectNotified.type,
        valueDate: notifiedOn,
        eventPublishedAt: occurredAt.getTime(),
      },
      defaults: {
        id: new UniqueEntityID().toString(),
      },
    })
  }
)
