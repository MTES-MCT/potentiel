import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { Fournisseur } from '../../project/types/fournisseur'

export type ModificationReceivedPayload = {
  modificationRequestId: string
  projectId: string
  requestedBy: string
  authority: 'dgec' | 'dreal'
  justification?: string
  fileId?: string
} & (
  | {
      type: 'puissance'
      puissance: number
      puissanceAuMomentDuDepot?: number // added later, so not always present
    }
  | { type: 'actionnaire'; actionnaire: string }
  | { type: 'producteur'; producteur: string }
  | { type: 'fournisseur'; fournisseurs?: Fournisseur[]; evaluationCarbone?: number }
)

export class ModificationReceived
  extends BaseDomainEvent<ModificationReceivedPayload>
  implements DomainEvent
{
  public static type: 'ModificationReceived' = 'ModificationReceived'
  public type = ModificationReceived.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ModificationReceivedPayload) {
    return payload.modificationRequestId
  }
}
