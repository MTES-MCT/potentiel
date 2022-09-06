import { onUserRightsToProjectRevoked } from './onUserRightsToProjectRevoked'
import { onUserRightsToProjectGranted } from './onUserRightsToProjectGranted'
import { onUserInvitedToProject } from './onUserInvitedToProject'
import { onUserProjectsLinkedByContactEmail } from './onUserProjectsLinkedByContactEmail'
import { logger } from '@core/utils'
import {
  UserInvitedToProject,
  UserProjectsLinkedByContactEmail,
  UserRightsToProjectRevoked,
  UserRightsToProjectGranted,
  DroitsSurLeProjetRévoqués,
} from '@modules/authZ'
import { ProjectClaimed, ProjectClaimedByOwner } from '@modules/projectClaim/events'
import { onProjectClaimed } from './onProjectClaimed'
import { EventBus } from '@core/domain'
import { onDroitsSurLeProjetRévoqués } from './onDroitsSurLeProjetRévoqués'

export const initUserProjectsProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(UserRightsToProjectRevoked.type, onUserRightsToProjectRevoked(models))
  eventBus.subscribe(UserRightsToProjectGranted.type, onUserRightsToProjectGranted(models))
  eventBus.subscribe(ProjectClaimed.type, onProjectClaimed(models))
  eventBus.subscribe(ProjectClaimedByOwner.type, onProjectClaimed(models))
  eventBus.subscribe(UserInvitedToProject.type, onUserInvitedToProject(models))
  eventBus.subscribe(
    UserProjectsLinkedByContactEmail.type,
    onUserProjectsLinkedByContactEmail(models)
  )
  eventBus.subscribe(DroitsSurLeProjetRévoqués.type, onDroitsSurLeProjetRévoqués(models))

  logger.info('Initialized User Projects projections')
}
export * from './onUserInvitedToProject'
