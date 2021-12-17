import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectImported } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectImported,
  async ({ payload: { projectId }, occurredAt }) => {
    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: ProjectImported.type,
      valueDate: occurredAt.getTime(),
    })
  }
)
