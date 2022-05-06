import { DomainEvent, BaseDomainEvent } from '@core/domain'

export interface EDFContractUpdatedPayload {
  projectId: string
  numero: string
  type?: string
  dateEffet?: string // de la forme MM/DD/YY (ex: 3/23/21)
  dateSignature?: string // de la forme MM/DD/YY (ex: 3/23/21)
  duree?: string
}

export class EDFContractUpdated
  extends BaseDomainEvent<EDFContractUpdatedPayload>
  implements DomainEvent
{
  public static type: 'EDFContractUpdated' = 'EDFContractUpdated'
  public type = EDFContractUpdated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: EDFContractUpdatedPayload) {
    return undefined
  }
}
