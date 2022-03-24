import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface ProjectCertificateObsoletePayload {
  projectId: string
}
export class ProjectCertificateObsolete
  extends BaseDomainEvent<ProjectCertificateObsoletePayload>
  implements DomainEvent
{
  public static type: 'ProjectCertificateObsolete' = 'ProjectCertificateObsolete'

  public type = ProjectCertificateObsolete.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<ProjectCertificateObsoletePayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: ProjectCertificateObsoletePayload) {
    return payload.projectId
  }
}
