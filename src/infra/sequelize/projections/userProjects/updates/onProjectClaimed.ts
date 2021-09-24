import { logger } from '../../../../../core/utils'
import { ProjectClaimed } from '../../../../../modules/project/events'
import { ProjectClaimedByOwner } from '../../../../../modules/projectClaim/events'

export const onProjectClaimed = (models) => async (
  event: ProjectClaimed | ProjectClaimedByOwner
) => {
  const { projectId, claimedBy } = event.payload
  const { UserProjects } = models

  try {
    // if (event.type === 'ProjectClaimed')
    //   await ProjectStep.create({
    //     id: new UniqueEntityID().toString(),
    //     type: 'attestation-designation-proof',
    //     projectId,
    //     stepDate: event.occurredAt,
    //     fileId: event.payload.attestationDesignationFileId,
    //     submittedBy: claimedBy,
    //     submittedOn: event.occurredAt,
    //   })

    await UserProjects.create({ userId: claimedBy, projectId })
  } catch (e) {
    logger.error(e)
  }
}
