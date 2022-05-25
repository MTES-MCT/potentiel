import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { ModificationRequestAcceptanceParams } from '../ModificationRequest'

export interface ModificationRequestAcceptedPayload {
  modificationRequestId: string
  params?: ModificationRequestAcceptanceParams | undefined
  acceptedBy: string
  responseFileId: string
}
export class ModificationRequestAccepted
  extends BaseDomainEvent<ModificationRequestAcceptedPayload>
  implements DomainEvent
{
  public static type: 'ModificationRequestAccepted' = 'ModificationRequestAccepted'
  public type = ModificationRequestAccepted.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ModificationRequestAcceptedPayload) {
    return payload.modificationRequestId
  }
}
