import { BaseDomainEvent, DomainEvent } from '@core/domain'

type Attachment = {
  id: string
  name: string
}

export interface DemandeDelaiSignaledPayload {
  projectId: string
  decidedOn: number
  newCompletionDueOn: number
  isAccepted: boolean
  isNewDateApplicable: boolean
  notes?: string
  attachments: Attachment[]
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
