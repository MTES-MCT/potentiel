import { BaseDomainEvent, DomainEvent } from '@core/domain'

type Attachment = {
  id: string
  name: string
}

export type DemandeRecoursSignaledPayload = {
  projectId: string
  decidedOn: number
  notes?: string
  attachments: Attachment[]
  signaledBy: string
  status: 'acceptée' | 'rejetée'
}

export class DemandeRecoursSignaled
  extends BaseDomainEvent<DemandeRecoursSignaledPayload>
  implements DomainEvent
{
  public static type: 'DemandeRecoursSignaled' = 'DemandeRecoursSignaled'
  public type = DemandeRecoursSignaled.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DemandeRecoursSignaledPayload) {
    return payload.projectId
  }
}
