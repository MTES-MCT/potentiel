import { EventBus } from '../../../../../modules/eventStore'

import { onUserRightsToProjectRevoked } from './onUserRightsToProjectRevoked'
import { onUserRightsToProjectGranted } from './onUserRightsToProjectGranted'
import { logger } from '../../../../../core/utils'
import {
  UserRightsToProjectRevoked,
  UserRightsToProjectGranted,
} from '../../../../../modules/authorization'
import { ProjectClaimed, ProjectClaimedByOwner } from '../../../../../modules/projectClaim/events'
import { onProjectClaimed } from './onProjectClaimed'

export const initUserProjectsProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(UserRightsToProjectRevoked.type, onUserRightsToProjectRevoked(models))
  eventBus.subscribe(UserRightsToProjectGranted.type, onUserRightsToProjectGranted(models))
  eventBus.subscribe(ProjectClaimed.type, onProjectClaimed(models))
  eventBus.subscribe(ProjectClaimedByOwner.type, onProjectClaimed(models))

  logger.info('Initialized User Projects projections')
}
