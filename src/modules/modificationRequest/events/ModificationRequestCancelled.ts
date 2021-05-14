import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ModificationRequestCancelledPayload {
  modificationRequestId: string
  cancelledBy: string
}
export class ModificationRequestCancelled
  extends BaseDomainEvent<ModificationRequestCancelledPayload>
  implements DomainEvent {
  public static type: 'ModificationRequestCancelled' = 'ModificationRequestCancelled'
  public type = ModificationRequestCancelled.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ModificationRequestCancelledPayload) {
    return payload.modificationRequestId
  }
}
