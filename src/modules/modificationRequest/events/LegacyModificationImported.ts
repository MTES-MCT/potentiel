import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { LegacyModificationDTO } from '../dtos'

export type LegacyModificationImportedPayload = {
  projectId: string
  importId: string
  modifications: LegacyModificationDTO[]
}

export class LegacyModificationImported
  extends BaseDomainEvent<LegacyModificationImportedPayload>
  implements DomainEvent
{
  public static type: 'LegacyModificationImported' = 'LegacyModificationImported'
  public type = LegacyModificationImported.type
  currentVersion = 1

  aggregateIdFromPayload(payload: LegacyModificationImportedPayload) {
    return [payload.importId, payload.projectId]
  }
}
