import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'
import { Project } from '../../../entities'

export interface ProjectNotificationDateSetPayload {
  projectId: Project['id']
  notifiedOn: Project['notifiedOn']
}
export class ProjectNotificationDateSet
  extends BaseDomainEvent<ProjectNotificationDateSetPayload>
  implements DomainEvent {
  public static type: 'ProjectNotificationDateSet' =
    'ProjectNotificationDateSet'
  public type = ProjectNotificationDateSet.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ProjectNotificationDateSetPayload) {
    return payload.projectId
  }
}
