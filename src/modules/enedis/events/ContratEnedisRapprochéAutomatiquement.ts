import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ContratEnedisRapprochéAutomatiquementPayload {
  projectId: string
  numero: string
  score: number
  rawValues: Record<string, string>
  // TODO
}

export class ContratEnedisRapprochéAutomatiquement
  extends BaseDomainEvent<ContratEnedisRapprochéAutomatiquementPayload>
  implements DomainEvent
{
  public static type: 'ContratEnedisRapprochéAutomatiquement' =
    'ContratEnedisRapprochéAutomatiquement'
  public type = ContratEnedisRapprochéAutomatiquement.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ContratEnedisRapprochéAutomatiquementPayload) {
    return undefined
  }
}
