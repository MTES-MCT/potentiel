import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ModificationRequestedPayload {
  type: string
  modificationRequestId: string
  projectId: string
  requestedBy: string
  fileId?: string
  justification?: string
}
export class ModificationRequested
  extends BaseDomainEvent<ModificationRequestedPayload>
  implements DomainEvent {
  public static type: 'ModificationRequested' = 'ModificationRequested'
  public type = ModificationRequested.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ModificationRequestedPayload) {
    return payload.modificationRequestId
  }
}
