import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface ProjectNewRulesOptedInPayload {
  projectId: string
  optedInBy: string
}

export class ProjectNewRulesOptedIn
  extends BaseDomainEvent<ProjectNewRulesOptedInPayload>
  implements DomainEvent
{
  public static type: 'ProjectNewRulesOptedIn' = 'ProjectNewRulesOptedIn'
  public type = ProjectNewRulesOptedIn.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<ProjectNewRulesOptedInPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: ProjectNewRulesOptedInPayload) {
    return payload.projectId
  }
}
