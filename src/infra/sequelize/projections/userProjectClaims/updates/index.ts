import { EventBus } from '../../../../../modules/eventStore'
import { logger } from '../../../../../core/utils'
import { ProjectClaimFailed } from '../../../../../modules/projectClaim/events'
import { onProjectClaimFailed } from './onProjectClaimFailed'

export const initUserProjectClaimsProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(ProjectClaimFailed.type, onProjectClaimFailed(models))

  logger.info('Initialized User Project Claims projections')
}
