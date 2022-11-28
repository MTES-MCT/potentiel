import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface ProjectGFInvalidéesPayload {
  projetId: string
  invalidéesPar: string
}

export class ProjectGFInvalidées
  extends BaseDomainEvent<ProjectGFInvalidéesPayload>
  implements DomainEvent
{
  public static type: 'ProjectGFInvalidées' = 'ProjectGFInvalidées'
  public type = ProjectGFInvalidées.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<ProjectGFInvalidéesPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: ProjectGFInvalidéesPayload) {
    return payload.projetId
  }
}
