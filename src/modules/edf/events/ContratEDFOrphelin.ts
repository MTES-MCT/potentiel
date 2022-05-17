import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ContratEDFOrphelinPayload {
  numero: string
  rawValues: Record<string, string>
}

export class ContratEDFOrphelin
  extends BaseDomainEvent<ContratEDFOrphelinPayload>
  implements DomainEvent
{
  public static type: 'ContratEDFOrphelin' = 'ContratEDFOrphelin'
  public type = ContratEDFOrphelin.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ContratEDFOrphelinPayload) {
    return undefined
  }
}
