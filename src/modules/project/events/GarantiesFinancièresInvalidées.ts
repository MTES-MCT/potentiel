import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface GarantiesFinancièresInvalidéesPayload {
  projetId: string
  invalidéesPar: string
}

export class GarantiesFinancièresInvalidées
  extends BaseDomainEvent<GarantiesFinancièresInvalidéesPayload>
  implements DomainEvent
{
  public static type: 'GarantiesFinancièresInvalidées' = 'GarantiesFinancièresInvalidées'
  public type = GarantiesFinancièresInvalidées.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<GarantiesFinancièresInvalidéesPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: GarantiesFinancièresInvalidéesPayload) {
    return payload.projetId
  }
}
