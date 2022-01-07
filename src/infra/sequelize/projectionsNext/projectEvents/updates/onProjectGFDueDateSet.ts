import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectGFDueDateSet } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectGFDueDateSet,
  async ({ payload: { projectId, garantiesFinancieresDueOn }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectGFDueDateSet.type,
        eventPublishedAt: occurredAt.getTime(),
        valueDate: garantiesFinancieresDueOn,
        id: new UniqueEntityID().toString(),
      },
      { transaction }
    )
  }
)
