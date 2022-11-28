import { logger } from '@core/utils'
import {
  ProjectGFRemoved,
  ProjectStepStatusUpdated,
  ProjectGFSubmitted,
  ProjectPTFRemoved,
  ProjectPTFSubmitted,
  ProjectGFValidées,
  ProjectGFInvalidées,
} from '@modules/project'
import { onProjectStepSubmitted } from './onProjectStepSubmitted'
import { onProjectStepRemoved } from './onProjectStepRemoved'
import { onProjectStepStatusUpdated } from './onProjectStepStatusUpdated'
import { EventBus } from '@core/domain'
import { onProjectGFValidées } from './onProjectGFValidées'
import { onProjectGFInvalidées } from './onProjectGFInvalidées'

export const initProjectPTFProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ProjectPTFSubmitted.type, onProjectStepSubmitted(models))
  eventBus.subscribe(ProjectGFSubmitted.type, onProjectStepSubmitted(models))
  eventBus.subscribe(ProjectStepStatusUpdated.type, onProjectStepStatusUpdated(models))

  eventBus.subscribe(ProjectGFValidées.type, onProjectGFValidées(models))
  eventBus.subscribe(ProjectGFInvalidées.type, onProjectGFInvalidées(models))

  eventBus.subscribe(ProjectPTFRemoved.type, onProjectStepRemoved(models))
  eventBus.subscribe(ProjectGFRemoved.type, onProjectStepRemoved(models))

  logger.info('Initialized Project PTF projections')
}
