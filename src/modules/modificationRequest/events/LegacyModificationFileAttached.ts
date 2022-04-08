import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface LegacyModificationFileAttachedPayload {
  fileId: string
  filename: string
  projectId: string
}

export class LegacyModificationFileAttached
  extends BaseDomainEvent<LegacyModificationFileAttachedPayload>
  implements DomainEvent
{
  public static type: 'LegacyModificationFileAttached' = 'LegacyModificationFileAttached'
  public type = LegacyModificationFileAttached.type
  currentVersion = 1

  aggregateIdFromPayload(payload: LegacyModificationFileAttachedPayload) {
    return undefined
  }
}
