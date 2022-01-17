import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface ProjectStepStatusUpdatedPayload {
  projectStepId: string
  statusUpdatedBy: string
  newStatus: string
}

export class ProjectStepStatusUpdated
  extends BaseDomainEvent<ProjectStepStatusUpdatedPayload>
  implements DomainEvent {
  public static type: 'ProjectStepStatusUpdated' = 'ProjectStepStatusUpdated'
  public type = ProjectStepStatusUpdated.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<ProjectStepStatusUpdatedPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: ProjectStepStatusUpdatedPayload) {
    return payload.projectStepId
  }
}
