import { UniqueEntityID } from '../../../../../core/domain'
import { logger } from '../../../../../core/utils'
import { ProjectClaimed } from '../../../../../modules/project/events'

export const onProjectClaimed = (models) => async (event: ProjectClaimed) => {
  const { ProjectStep } = models
  const { projectId, attestationDesignationFileId, claimedBy } = event.payload

  try {
    await ProjectStep.create({
      id: new UniqueEntityID().toString(),
      type: 'attestation-designation-proof',
      projectId,
      stepDate: event.occurredAt,
      fileId: attestationDesignationFileId,
      submittedBy: claimedBy,
      submittedOn: event.occurredAt,
    })
  } catch (e) {
    logger.error(e)
  }
}
