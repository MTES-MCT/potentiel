import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ContratEnedisOrphelinPayload {
  numero: string
  rawValues: Record<string, string>
}

export class ContratEnedisOrphelin
  extends BaseDomainEvent<ContratEnedisOrphelinPayload>
  implements DomainEvent
{
  public static type: 'ContratEnedisOrphelin' = 'ContratEnedisOrphelin'
  public type = ContratEnedisOrphelin.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ContratEnedisOrphelinPayload) {
    return undefined
  }
}
