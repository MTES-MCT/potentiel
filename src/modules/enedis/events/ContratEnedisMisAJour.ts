import { DomainEvent, BaseDomainEvent } from '@core/domain'

export interface ContratEnedisMisAJourPayload {
  projectId: string
  numero: string
  // TODO
}

export class ContratEnedisMisAJour
  extends BaseDomainEvent<ContratEnedisMisAJourPayload>
  implements DomainEvent
{
  public static type: 'ContratEnedisMisAJour' = 'ContratEnedisMisAJour'
  public type = ContratEnedisMisAJour.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ContratEnedisMisAJourPayload) {
    return undefined
  }
}
