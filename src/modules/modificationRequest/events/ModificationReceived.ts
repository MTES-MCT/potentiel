import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { Fournisseur } from '../../project/types/fournisseur'

export interface ModificationReceivedPayload {
  modificationRequestId: string
  type: string
  projectId: string
  requestedBy: string
  authority: 'dgec' | 'dreal'
  puissance?: number
  actionnaire?: string
  producteur?: string
  fournisseurs?: Fournisseur[]
  evaluationCarbone?: number
  justification?: string
  fileId?: string
}

export class ModificationReceived
  extends BaseDomainEvent<ModificationReceivedPayload>
  implements DomainEvent {
  public static type: 'ModificationReceived' = 'ModificationReceived'
  public type = ModificationReceived.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ModificationReceivedPayload) {
    return payload.modificationRequestId
  }
}
