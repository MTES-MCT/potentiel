import { BaseDomainEvent, DomainEvent } from '../../../core/domain';

export interface ProjectGFRemovedPayload {
  projectId: string;
  removedBy?: string;
}
export class ProjectGFRemoved
  extends BaseDomainEvent<ProjectGFRemovedPayload>
  implements DomainEvent
{
  public static type: 'ProjectGFRemoved' = 'ProjectGFRemoved';
  public type = ProjectGFRemoved.type;
  currentVersion = 1;

  aggregateIdFromPayload(payload: ProjectGFRemovedPayload) {
    return payload.projectId;
  }
}
