import { logger } from '../../../../../core/utils'
import { ProjectPTFRemoved } from '../../../../../modules/project/events'

export const onProjectPTFRemoved = (models) => async (event: ProjectPTFRemoved) => {
  const { ProjectStep } = models

  const { projectId } = event.payload
  try {
    await ProjectStep.destroy({
      where: {
        type: 'ptf',
        projectId,
      },
    })
  } catch (e) {
    logger.error(e)
  }
}
