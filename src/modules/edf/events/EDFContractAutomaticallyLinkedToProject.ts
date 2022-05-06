import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface EDFContractAutomaticallyLinkedToProjectPayload {
  projectId: string
  numero: string
  type: string
  dateEffet: string // de la forme MM/DD/YY (ex: 3/23/21)
  dateSignature: string // de la forme MM/DD/YY (ex: 3/23/21)
  duree: string
  rawValues: Record<string, string>
  score: number
}

export class EDFContractAutomaticallyLinkedToProject
  extends BaseDomainEvent<EDFContractAutomaticallyLinkedToProjectPayload>
  implements DomainEvent
{
  public static type: 'EDFContractAutomaticallyLinkedToProject' =
    'EDFContractAutomaticallyLinkedToProject'
  public type = EDFContractAutomaticallyLinkedToProject.type
  currentVersion = 1

  aggregateIdFromPayload(payload: EDFContractAutomaticallyLinkedToProjectPayload) {
    return undefined
  }
}
