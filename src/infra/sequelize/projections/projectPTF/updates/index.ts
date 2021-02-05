import { logger } from '../../../../../core/utils'
import { EventBus } from '../../../../../modules/eventStore'
import { ProjectPTFSubmitted } from '../../../../../modules/project/events'
import { onProjectPTFSubmitted } from './onProjectPTFSubmitted'

export const initProjectPTFProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ProjectPTFSubmitted.type, onProjectPTFSubmitted(models))

  logger.info('Initialized Project PTF projections')
}
