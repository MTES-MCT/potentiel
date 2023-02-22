import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain';

export interface ProjectDCRSubmittedPayload {
  projectId: string;
  dcrDate: Date;
  fileId: string;
  numeroDossier: string;
  submittedBy: string;
}
export class ProjectDCRSubmitted
  extends BaseDomainEvent<ProjectDCRSubmittedPayload>
  implements DomainEvent
{
  public static type: 'ProjectDCRSubmitted' = 'ProjectDCRSubmitted';
  public type = ProjectDCRSubmitted.type;
  currentVersion = 1;

  constructor(props: BaseDomainEventProps<ProjectDCRSubmittedPayload>) {
    super(props);
  }

  aggregateIdFromPayload(payload: ProjectDCRSubmittedPayload) {
    return payload.projectId;
  }
}
