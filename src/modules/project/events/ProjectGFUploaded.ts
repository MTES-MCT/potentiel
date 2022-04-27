import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface ProjectGFUploadedPayload {
  projectId: string
  gfDate: Date
  fileId: string
  submittedBy: string
  expirationDate?: Date
}
export class ProjectGFUploaded
  extends BaseDomainEvent<ProjectGFUploadedPayload>
  implements DomainEvent
{
  public static type: 'ProjectGFUploaded' = 'ProjectGFUploaded'
  public type = ProjectGFUploaded.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<ProjectGFUploadedPayload>) {
    super(props)

    // convert to date (in case it is a string)
    this.payload.gfDate = new Date(this.payload.gfDate)
  }

  aggregateIdFromPayload(payload: ProjectGFUploadedPayload) {
    return payload.projectId
  }
}
