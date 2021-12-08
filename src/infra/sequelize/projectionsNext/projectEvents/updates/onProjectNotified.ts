import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectNotified } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectNotified,
  async ({ payload: { projectId, notifiedOn } }) => {
    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: ProjectNotified.type,
      valueDate: notifiedOn,
    })
  }
)
