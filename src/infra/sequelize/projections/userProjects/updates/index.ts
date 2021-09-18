import { EventBus } from '../../../../../modules/eventStore'

import { onUserRightsToProjectRevoked } from './onUserRightsToProjectRevoked'
import { onUserRightsToProjectGranted } from './onUserRightsToProjectGranted'
import { logger } from '../../../../../core/utils'
import {
  UserRightsToProjectGranted,
  UserRightsToProjectRevoked,
} from '../../../../../modules/authorization'

export const initUserProjectsProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(UserRightsToProjectRevoked.type, onUserRightsToProjectRevoked(models))
  eventBus.subscribe(UserRightsToProjectGranted.type, onUserRightsToProjectGranted(models))

  logger.info('Initialized User Projects projections')
}
