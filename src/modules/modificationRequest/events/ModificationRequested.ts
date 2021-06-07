import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { FournisseurKind } from '../../../entities/fournisseur'

export interface ModificationRequestedPayload {
  type: string
  modificationRequestId: string
  projectId: string
  requestedBy: string
  fileId?: string
  justification?: string
  actionnaire?: string
  producteur?: string
  fournisseurs?: FournisseurKind[]
  puissance?: number
  evaluationCarbone?: number
  delayInMonths?: number
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
