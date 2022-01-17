import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface ModificationRequestStatusUpdatedPayload {
  modificationRequestId: string
  updatedBy: string
  newStatus: string
}
export class ModificationRequestStatusUpdated
  extends BaseDomainEvent<ModificationRequestStatusUpdatedPayload>
  implements DomainEvent {
  public static type: 'ModificationRequestStatusUpdated' = 'ModificationRequestStatusUpdated'
  public type = ModificationRequestStatusUpdated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ModificationRequestStatusUpdatedPayload) {
    return payload.modificationRequestId
  }
}
