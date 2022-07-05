import { Op } from 'sequelize'
import { logger } from '@core/utils'
import { ProjectGFRemoved, ProjectGFWithdrawn, ProjectPTFRemoved } from '@modules/project'

type StepRemovedEvent = ProjectPTFRemoved | ProjectGFRemoved | ProjectGFWithdrawn

const StepTypeByEventType: Record<StepRemovedEvent['type'], string> = {
  [ProjectPTFRemoved.type]: 'ptf',
  [ProjectGFRemoved.type]: 'garantie-financiere',
  [ProjectGFWithdrawn.type]: 'garantie-financiere',
}

export const onProjectStepRemoved = (models) => async (event: StepRemovedEvent) => {
  const { ProjectStep } = models

  const { projectId } = event.payload
  try {
    if (event.type === ProjectGFWithdrawn.type) {
      await ProjectStep.destroy({
        where: {
          type: StepTypeByEventType[event.type],
          projectId,
        },
      })
    } else {
      await ProjectStep.destroy({
        where: {
          type: StepTypeByEventType[event.type],
          projectId,
          [Op.or]: [{ status: null }, { status: 'à traiter' }],
        },
      })
    }
  } catch (e) {
    logger.error(e)
  }
}
