import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectPuissanceSubmittedPayload {
  projectId: string
  newPuissance: number
  submittedBy: string
}

export class ProjectPuissanceSubmitted
  extends BaseDomainEvent<ProjectPuissanceSubmittedPayload>
  implements DomainEvent {
  public static type: 'ProjectPuissanceSubmitted' = 'ProjectPuissanceSubmitted'
  public type = ProjectPuissanceSubmitted.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectPuissanceSubmittedPayload) {
    return payload.projectId
  }
}
