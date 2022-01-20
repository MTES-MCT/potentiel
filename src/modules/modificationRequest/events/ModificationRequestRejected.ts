import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface ModificationRequestRejectedPayload {
  modificationRequestId: string
  responseFileId: string
  rejectedBy: string
}
export class ModificationRequestRejected
  extends BaseDomainEvent<ModificationRequestRejectedPayload>
  implements DomainEvent {
  public static type: 'ModificationRequestRejected' = 'ModificationRequestRejected'
  public type = ModificationRequestRejected.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ModificationRequestRejectedPayload) {
    return payload.modificationRequestId
  }
}
