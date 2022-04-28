import { BaseDomainEvent, DomainEvent } from '@core/domain'

type Attachment = {
  id: string
  name: string
}

export type DemandeDelaiSignaledPayload = {
  projectId: string
  decidedOn: number
  notes?: string
  attachments: Attachment[]
  signaledBy: string
} & (
  | {
      status: 'acceptée'
      oldCompletionDueOn?: number
      newCompletionDueOn: number
    }
  | {
      status: 'rejetée' | 'accord-de-principe'
    }
)
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
