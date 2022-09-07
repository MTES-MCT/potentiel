import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

type NouveauCahierDesChargesChoisiPayload = {
  projetId: string
  choisiPar: string
  cahierDesCharges: {
    id: string
    référence: string
  }
}

export class NouveauCahierDesChargesChoisi
  extends BaseDomainEvent<NouveauCahierDesChargesChoisiPayload>
  implements DomainEvent
{
  public static type: 'NouveauCahierDesChargesChoisi' = 'NouveauCahierDesChargesChoisi'
  public type = NouveauCahierDesChargesChoisi.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<NouveauCahierDesChargesChoisiPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: NouveauCahierDesChargesChoisiPayload) {
    return payload.projetId
  }
}
