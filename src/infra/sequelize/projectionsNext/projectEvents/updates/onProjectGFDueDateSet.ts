import { UniqueEntityID } from '@core/domain'
import { ProjectGFDueDateSet } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
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
