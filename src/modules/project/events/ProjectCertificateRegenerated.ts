import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface ProjectCertificateRegeneratedPayload {
  certificateFileId: string
  projectVersionDate: Date
  projectId: string
  reason?: string
}
export class ProjectCertificateRegenerated
  extends BaseDomainEvent<ProjectCertificateRegeneratedPayload>
  implements DomainEvent {
  public static type: 'ProjectCertificateRegenerated' = 'ProjectCertificateRegenerated'

  public type = ProjectCertificateRegenerated.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<ProjectCertificateRegeneratedPayload>) {
    super(props)

    // convert to date (in case it is a string)
    this.payload.projectVersionDate = new Date(this.payload.projectVersionDate)
  }

  aggregateIdFromPayload(payload: ProjectCertificateRegeneratedPayload) {
    return payload.projectId
  }
}
