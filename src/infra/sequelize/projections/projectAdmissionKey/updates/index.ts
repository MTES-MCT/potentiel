import { EventBus } from '../../../../../modules/eventStore'

import { onInvitationToProjectCancelled } from './onInvitationToProjectCancelled'
import { logger } from '../../../../../core/utils'
import { InvitationToProjectCancelled } from '../../../../../modules/authorization'

export const initAdmissionKeyProjections = (eventBus: EventBus, models) => {
  eventBus.subscribe(InvitationToProjectCancelled.type, onInvitationToProjectCancelled(models))

  logger.info('Initialized ProjectAdmissionKeys projections')
}
