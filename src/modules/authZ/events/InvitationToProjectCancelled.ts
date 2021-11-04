import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

//
// This event is a value dump for items that were in the projects database table before the switch to event sourcing
//

export interface InvitationToProjectCancelledPayload {
  projectAdmissionKeyId: string
  cancelledBy: string
}
export class InvitationToProjectCancelled
  extends BaseDomainEvent<InvitationToProjectCancelledPayload>
  implements DomainEvent {
  public static type: 'InvitationToProjectCancelled' = 'InvitationToProjectCancelled'
  public type = InvitationToProjectCancelled.type
  currentVersion = 1

  aggregateIdFromPayload(payload: InvitationToProjectCancelledPayload) {
    return undefined
  }
}
