import { logger } from '@core/utils'
import { ProjectPTFRemoved, ProjectPTFSubmitted } from '@modules/project'
import { onProjectStepSubmitted } from './onProjectStepSubmitted'
import { onProjectStepRemoved } from './onProjectStepRemoved'
import { EventBus } from '@core/domain'

export const initProjectPTFProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ProjectPTFSubmitted.type, onProjectStepSubmitted(models))
  eventBus.subscribe(ProjectPTFRemoved.type, onProjectStepRemoved(models))

  logger.info('Initialized Project PTF projections')
}
