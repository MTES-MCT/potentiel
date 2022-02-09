import { Op } from 'sequelize'
import { logger } from '@core/utils'
import {
  ProjectDCRRemoved,
  ProjectGFRemoved,
  ProjectGFWithdrawn,
  ProjectPTFRemoved,
} from '@modules/project'

type StepRemovedEvent =
  | ProjectPTFRemoved
  | ProjectDCRRemoved
  | ProjectGFRemoved
  | ProjectGFWithdrawn

const StepTypeByEventType: Record<StepRemovedEvent['type'], string> = {
  [ProjectPTFRemoved.type]: 'ptf',
  [ProjectDCRRemoved.type]: 'dcr',
  [ProjectGFRemoved.type]: 'garantie-financiere',
  [ProjectGFWithdrawn.type]: 'garantie-financiere-ppe2',
}

export const onProjectStepRemoved = (models) => async (event: StepRemovedEvent) => {
  const { ProjectStep } = models

  const { projectId } = event.payload
  try {
    await ProjectStep.destroy({
      where: {
        type: StepTypeByEventType[event.type],
        projectId,
        [Op.or]: [{ status: null }, { status: 'à traiter' }],
      },
    })
  } catch (e) {
    logger.error(e)
  }
}
