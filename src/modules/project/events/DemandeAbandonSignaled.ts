import { BaseDomainEvent, DomainEvent } from '@core/domain'

type Attachment = {
  id: string
  name: string
}

export type DemandeAbandonSignaledPayload = {
  projectId: string
  decidedOn: number
  notes?: string
  attachments: Attachment[]
  signaledBy: string
  status: 'acceptée' | 'rejetée'
}

export class DemandeAbandonSignaled
  extends BaseDomainEvent<DemandeAbandonSignaledPayload>
  implements DomainEvent
{
  public static type: 'DemandeAbandonSignaled' = 'DemandeAbandonSignaled'
  public type = DemandeAbandonSignaled.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DemandeAbandonSignaledPayload) {
    return payload.projectId
  }
}
