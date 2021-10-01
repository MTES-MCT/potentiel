import { logger } from '../../../../../core/utils'
import { ProjectReimported } from '../../../../../modules/project/events'

export const onProjectReimported = (models) => async (event: ProjectReimported) => {
  const { Project } = models

  const { projectId, data } = event.payload

  try {
    const project = await Project.findByPk(projectId)

    if (project === null) {
      throw new Error(`onProjectReimported for project that is not found ${projectId}`)
    }

    const { details, ...other } = data

    if (details) {
      Object.assign(project.details, details)
      project.changed('details', true)
    }

    Object.assign(project, other)

    await project.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectReimported projection failed to update project', event)
  }
}
