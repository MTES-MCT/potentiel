import { logger } from '@core/utils'
import { ProjectCertificateObsolete } from '@modules/project'

export const onProjectCertificateObsolete =
  (models) => async (event: ProjectCertificateObsolete) => {
    const ProjectModel = models.Project
    const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

    if (!projectInstance) {
      logger.error(
        `Error: onProjectCertificateObsolete projection failed to retrieve project from db' ${event}`
      )
      return
    }

    projectInstance.certificateFileId = null

    try {
      await projectInstance.save()
    } catch (e) {
      logger.error(e)
      logger.info('Error: onProjectCertificateObsolete projection failed to update project', event)
    }
  }
