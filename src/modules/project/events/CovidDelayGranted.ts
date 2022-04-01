import { DomainEvent, BaseDomainEvent } from '@core/domain'

export interface CovidDelayGrantedPayload {
  projectId: string
  completionDueOn: number
}

export class CovidDelayGranted
  extends BaseDomainEvent<CovidDelayGrantedPayload>
  implements DomainEvent
{
  public static type: 'CovidDelayGranted' = 'CovidDelayGranted'
  public type = CovidDelayGranted.type
  currentVersion = 1

  aggregateIdFromPayload(payload: CovidDelayGrantedPayload) {
    return payload.projectId
  }
}
