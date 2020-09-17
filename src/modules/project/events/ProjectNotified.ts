import { Project } from '../../../entities'
import { DomainEvent } from '../../../core/domain/DomainEvent'

export interface ProjectNotifiedPayload {
  projectId: Project['id']
}
export class ProjectNotified implements DomainEvent<ProjectNotifiedPayload> {
  public occurredAt: Date
  public type = 'ProjectNotified'
  public payload: ProjectNotifiedPayload

  constructor(payload: ProjectNotifiedPayload) {
    this.occurredAt = new Date()
    this.payload = payload
  }
}
