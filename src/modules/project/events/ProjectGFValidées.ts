import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface ProjectGFValidéesPayload {
  projetId: string
  validéesPar: string
}

export class ProjectGFValidées
  extends BaseDomainEvent<ProjectGFValidéesPayload>
  implements DomainEvent
{
  public static type: 'ProjectGFValidées' = 'ProjectGFValidées'
  public type = ProjectGFValidées.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<ProjectGFValidéesPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: ProjectGFValidéesPayload) {
    return payload.projetId
  }
}
