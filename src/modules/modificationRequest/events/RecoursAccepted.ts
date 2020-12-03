import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface RecoursAcceptedPayload {
  modificationRequestId: string
  acceptedBy: string
}
export class RecoursAccepted
  extends BaseDomainEvent<RecoursAcceptedPayload>
  implements DomainEvent {
  public static type: 'RecoursAccepted' = 'RecoursAccepted'
  public type = RecoursAccepted.type
  currentVersion = 1

  aggregateIdFromPayload(payload: RecoursAcceptedPayload) {
    return payload.modificationRequestId
  }
}
