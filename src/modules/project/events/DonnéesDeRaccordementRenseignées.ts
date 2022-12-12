import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export type DonnéesDeRaccordementRenseignéesdPayload = {
  projetId: string
} & (
  | { dateMiseEnService: Date; dateFileAttente: Date }
  | { dateMiseEnService: Date }
  | { dateFileAttente: Date }
)

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
