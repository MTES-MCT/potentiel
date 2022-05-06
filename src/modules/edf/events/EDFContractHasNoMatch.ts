import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface EDFContractHasNoMatchPayload {
  numero: string
  rawValues: Record<string, string>
}

export class EDFContractHasNoMatch
  extends BaseDomainEvent<EDFContractHasNoMatchPayload>
  implements DomainEvent
{
  public static type: 'EDFContractHasNoMatch' = 'EDFContractHasNoMatch'
  public type = EDFContractHasNoMatch.type
  currentVersion = 1

  aggregateIdFromPayload(payload: EDFContractHasNoMatchPayload) {
    return undefined
  }
}
