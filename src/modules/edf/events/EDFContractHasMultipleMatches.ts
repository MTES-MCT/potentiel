import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

type Match = {
  projectId: string
  score: number
}

export interface EDFContractHasMultipleMatchesPayload {
  numero: string
  rawValues: Record<string, string>
  matches: Match[]
}

export class EDFContractHasMultipleMatches
  extends BaseDomainEvent<EDFContractHasMultipleMatchesPayload>
  implements DomainEvent
{
  public static type: 'EDFContractHasMultipleMatches' = 'EDFContractHasMultipleMatches'
  public type = EDFContractHasMultipleMatches.type
  currentVersion = 1

  aggregateIdFromPayload(payload: EDFContractHasMultipleMatchesPayload) {
    return undefined
  }
}
