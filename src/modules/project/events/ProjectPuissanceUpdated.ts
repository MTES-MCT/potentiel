import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectPuissanceUpdatedPayload {
  projectId: string
  newPuissance: number
  updatedBy: string
}

export class ProjectPuissanceUpdated
  extends BaseDomainEvent<ProjectPuissanceUpdatedPayload>
  implements DomainEvent {
  public static type: 'ProjectPuissanceUpdated' = 'ProjectPuissanceUpdated'
  public type = ProjectPuissanceUpdated.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectPuissanceUpdatedPayload) {
    return payload.projectId
  }
}
