import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface GarantiesFinancièresValidéesPayload {
  projetId: string
  validéesPar: string
}

export class GarantiesFinancièresValidées
  extends BaseDomainEvent<GarantiesFinancièresValidéesPayload>
  implements DomainEvent
{
  public static type: 'GarantiesFinancièresValidées' = 'GarantiesFinancièresValidées'
  public type = GarantiesFinancièresValidées.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<GarantiesFinancièresValidéesPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: GarantiesFinancièresValidéesPayload) {
    return payload.projetId
  }
}
