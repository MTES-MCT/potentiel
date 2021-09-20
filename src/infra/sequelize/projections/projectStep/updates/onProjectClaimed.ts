import { UniqueEntityID } from '../../../../../core/domain'
import { logger } from '../../../../../core/utils'
import { ProjectClaimed, ProjectClaimedByOwner } from '../../../../../modules/project/events'
import { UserRepo } from '../../../../../dataAccess'

export const onProjectClaimed = (models, userRepos: UserRepo) => async (
  event: ProjectClaimed | ProjectClaimedByOwner
) => {
  const { ProjectStep } = models
  const { projectId, claimedBy } = event.payload

  try {
    if (event.type === 'ProjectClaimed')
      await ProjectStep.create({
        id: new UniqueEntityID().toString(),
        type: 'attestation-designation-proof',
        projectId,
        stepDate: event.occurredAt,
        fileId: event.payload.attestationDesignationFileId,
        submittedBy: claimedBy,
        submittedOn: event.occurredAt,
      })

    await userRepos.addProject(claimedBy, projectId)
  } catch (e) {
    logger.error(e)
  }
}
