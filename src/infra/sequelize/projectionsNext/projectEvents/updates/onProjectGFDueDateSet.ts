import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectGFDueDateSet } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectGFDueDateSet,
  async ({ payload: { projectId, garantiesFinancieresDueOn }, occurredAt }) => {
    await ProjectEvent.findOrCreate({
      where: {
        projectId,
        type: ProjectGFDueDateSet.type,
        eventPublishedAt: occurredAt.getTime(),
        valueDate: garantiesFinancieresDueOn,
      },
      defaults: {
        id: new UniqueEntityID().toString(),
      },
    })
  }
)
