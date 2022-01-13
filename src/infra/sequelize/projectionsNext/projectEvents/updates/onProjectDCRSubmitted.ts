import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectDCRSubmitted } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export const onProjectDCRSubmitted = ProjectEvent.projector.on(
  ProjectDCRSubmitted,
  async ({ payload: { projectId, fileId, submittedBy, dcrDate }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectDCRSubmitted.type,
        valueDate: dcrDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { fileId, submittedBy },
      },
      { transaction }
    )
  }
)
