import {
  BaseDomainEvent,
  BaseDomainEventProps,
  DomainEvent,
} from '../../../core/domain/DomainEvent'

export interface NumeroGestionnaireSubmittedPayload {
  projectId: string
  numeroGestionnaire: string
  submittedBy: string
}
export class NumeroGestionnaireSubmitted
  extends BaseDomainEvent<NumeroGestionnaireSubmittedPayload>
  implements DomainEvent {
  public static type: 'NumeroGestionnaireSubmitted' = 'NumeroGestionnaireSubmitted'
  public type = NumeroGestionnaireSubmitted.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<NumeroGestionnaireSubmittedPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: NumeroGestionnaireSubmittedPayload) {
    return payload.projectId
  }
}
