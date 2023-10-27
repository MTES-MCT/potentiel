import { BaseDomainEvent, DomainEvent } from '../../../core/domain';

export interface ProjectCompletionDueDateSetPayload {
  projectId: string;
  completionDueOn: number;
  setBy?: string;
  reason?:
    | 'délaiCdc2022'
    | 'ChoixCDCAnnuleDélaiCdc2022'
    | 'DateMiseEnServiceAnnuleDélaiCdc2022'
    | 'DemandeComplèteRaccordementTransmiseAnnuleDélaiCdc2022';
}
export class ProjectCompletionDueDateSet
  extends BaseDomainEvent<ProjectCompletionDueDateSetPayload>
  implements DomainEvent
{
  public static type: 'ProjectCompletionDueDateSet' = 'ProjectCompletionDueDateSet';
  public type = ProjectCompletionDueDateSet.type;
  currentVersion = 2;

  aggregateIdFromPayload(payload: ProjectCompletionDueDateSetPayload) {
    return payload.projectId;
  }
}
