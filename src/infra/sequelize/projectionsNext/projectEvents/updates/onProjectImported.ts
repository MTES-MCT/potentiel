import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectImported } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectImported,
  async ({ payload: { projectId }, occurredAt }) => {
    await ProjectEvent.findOrCreate({
      where: {
        projectId,
        type: ProjectImported.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
      },
      defaults: {
        id: new UniqueEntityID().toString(),
      },
    })
  }
)
