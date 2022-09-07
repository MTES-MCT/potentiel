import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

type NouveauCahierDesChargesChoisiPayload = {
  projetId: string
  choisiPar: string
  cahierDesCharges: '30/07/2021'
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
