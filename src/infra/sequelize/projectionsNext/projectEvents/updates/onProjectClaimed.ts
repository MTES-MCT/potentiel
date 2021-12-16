import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectClaimed } from '../../../../../modules/projectClaim'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectClaimed,
  async ({ payload: { projectId, attestationDesignationFileId, claimedBy }, occurredAt }) => {
    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: ProjectClaimed.type,
      valueDate: occurredAt.getTime(),
      payload: {
        attestationDesignationFileId,
        claimedBy,
      },
    })
  }
)
