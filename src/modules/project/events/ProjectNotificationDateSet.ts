import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectNotificationDateSetPayload {
  projectId: string
  notifiedOn: number
  setBy: string // userId
}
export class ProjectNotificationDateSet
  extends BaseDomainEvent<ProjectNotificationDateSetPayload>
  implements DomainEvent {
  public static type: 'ProjectNotificationDateSet' = 'ProjectNotificationDateSet'

  public type = ProjectNotificationDateSet.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectNotificationDateSetPayload) {
    return payload.projectId
  }
}
