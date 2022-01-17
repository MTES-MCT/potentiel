import { logger } from '../../../../../core/utils'
import { ProjectClaimed, ProjectClaimedByOwner } from '@modules/projectClaim/events'
import { EntityNotFoundError } from '../../../../../modules/shared'

export const onProjectClaimed = (models) => async (
  event: ProjectClaimed | ProjectClaimedByOwner
) => {
  const { projectId, claimerEmail } = event.payload
  const { Project } = models

  try {
    const project = await Project.findByPk(projectId)

    if (project === null) {
      throw new EntityNotFoundError()
    }

    project.email = claimerEmail

    if (!project.certificateFileId && event.type === ProjectClaimed.type) {
      const { attestationDesignationFileId } = event.payload
      project.certificateFileId = attestationDesignationFileId
    }

    await project.save()
  } catch (e) {
    logger.error(e)
  }
}
