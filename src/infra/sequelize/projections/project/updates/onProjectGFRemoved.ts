import { logger } from '@core/utils'
import { ProjectGFRemoved } from '@modules/project'

export const onProjectGFRemoved = (models) => async (event: ProjectGFRemoved) => {
  const { ProjectStep } = models
  const { projectId } = event.payload

  try {
    await ProjectStep.destroy({
      where: {
        projectId,
        type: 'garantie-financiere',
      },
    })
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectGFRemoved projection failed to update project step', event)
  }
}
