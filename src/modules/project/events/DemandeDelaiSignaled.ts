import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface DemandeDelaiSignaledPayload {
  projectId: string
  newCompletionDueOn: number
  isAccepted: boolean
  isNewDateApplicable: boolean
  notes?: string
  attachments?: string[]
  signaledBy: string
}
export class DemandeDelaiSignaled
  extends BaseDomainEvent<DemandeDelaiSignaledPayload>
  implements DomainEvent
{
  public static type: 'DemandeDelaiSignaled' = 'DemandeDelaiSignaled'
  public type = DemandeDelaiSignaled.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DemandeDelaiSignaledPayload) {
    return payload.projectId
  }
}
