import { BaseDomainEvent, DomainEvent } from '@core/domain'

// this is event is for PPE2 GF (deemed validated) that has been uploaded in Potentiel just for information

export interface ProjectGFWithdrawnPayload {
  projectId: string
  removedBy: string
}
export class ProjectGFWithdrawn
  extends BaseDomainEvent<ProjectGFWithdrawnPayload>
  implements DomainEvent
{
  public static type: 'ProjectGFWithdrawn' = 'ProjectGFWithdrawn'
  public type = ProjectGFWithdrawn.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectGFWithdrawnPayload) {
    return payload.projectId
  }
}
