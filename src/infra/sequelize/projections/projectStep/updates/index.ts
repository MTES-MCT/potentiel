import { logger } from '../../../../../core/utils'
import { EventBus } from '../../../../../modules/eventStore'
import { ProjectPTFRemoved, ProjectPTFSubmitted } from '../../../../../modules/project/events'
import { onProjectPTFSubmitted } from './onProjectPTFSubmitted'
import { onProjectPTFRemoved } from './onProjectPTFRemoved'

export const initProjectPTFProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ProjectPTFSubmitted.type, onProjectPTFSubmitted(models))
  eventBus.subscribe(ProjectPTFRemoved.type, onProjectPTFRemoved(models))

  logger.info('Initialized Project PTF projections')
}
