import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface ProjectPTFSubmittedPayload {
  projectId: string
  ptfDate: Date
  fileId: string
  submittedBy: string
}
export class ProjectPTFSubmitted
  extends BaseDomainEvent<ProjectPTFSubmittedPayload>
  implements DomainEvent
{
  public static type: 'ProjectPTFSubmitted' = 'ProjectPTFSubmitted'
  public type = ProjectPTFSubmitted.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<ProjectPTFSubmittedPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: ProjectPTFSubmittedPayload) {
    return payload.projectId
  }
}
