import { Op } from 'sequelize'
import { logger } from '@core/utils'
import { ProjectGFRemoved } from '@modules/project'

export const onProjectGFRemoved = (models) => async (event: ProjectGFRemoved) => {
  const { ProjectStep } = models
  const { projectId } = event.payload

  try {
    await ProjectStep.update(
      { status: 'invalidé' },
      {
        where: {
          projectId,
          type: 'garantie-financiere',
          [Op.or]: [{ status: ['à traiter', 'validé'] }, { status: null }],
        },
      }
    )
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectGFRemoved projection failed to update project step', event)
  }
}
