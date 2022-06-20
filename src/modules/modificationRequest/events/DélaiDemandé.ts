import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type DélaiDemandéPayload = {
  demandeDélaiId: string
  projectId: string
  autorité: 'dgec' | 'dreal'
  fileId?: string
  justification?: string
  dateAchèvementDemandée: Date
} & ({ requestedBy?: { role: 'porteur-projet'; userId: string } } | { isLegacy?: true })

export class DélaiDemandé extends BaseDomainEvent<DélaiDemandéPayload> implements DomainEvent {
  public static type: 'DélaiDemandé' = 'DélaiDemandé'
  public type = DélaiDemandé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DélaiDemandéPayload) {
    return payload.demandeDélaiId
  }
}
