import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

type DonnéesDeRaccordementRenseignéesdPayload = {
  projetId: string
  dateMiseEnService: string
}

export class DonnéesDeRaccordementRenseignées
  extends BaseDomainEvent<DonnéesDeRaccordementRenseignéesdPayload>
  implements DomainEvent
{
  public static type: 'DonnéesDeRaccordementRenseignées' = 'DonnéesDeRaccordementRenseignées'
  public type = DonnéesDeRaccordementRenseignées.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<DonnéesDeRaccordementRenseignéesdPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: DonnéesDeRaccordementRenseignéesdPayload) {
    return payload.projetId
  }
}
