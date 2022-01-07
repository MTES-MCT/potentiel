import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectClaimed } from '../../../../../modules/projectClaim'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectClaimed,
  async (
    { payload: { projectId, attestationDesignationFileId, claimedBy }, occurredAt },
    transaction
  ) => {
    await ProjectEvent.findOrCreate({
      where: {
        projectId,
        type: ProjectClaimed.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
      },
      defaults: {
        id: new UniqueEntityID().toString(),
        payload: {
          attestationDesignationFileId,
          claimedBy,
        },
      },
      transaction,
    })
  }
)
