import { logger } from '@core/utils'
import { ProjectGFInvalidated } from '@modules/project'

export const onProjectGFInvalidated = (models) => async (event: ProjectGFInvalidated) => {
  const { Project } = models
  const { projectId } = event.payload

  try {
    await Project.update({ garantiesFinancieresFileId: null }, { where: { id: projectId } })
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectGFInvalidated projection failed to update project', event)
  }
}
