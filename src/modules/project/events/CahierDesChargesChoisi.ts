import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

type CahierDesChargesChoisiType =
  | {
      type: 'initial'
    }
  | {
      type: 'modifié'
      paruLe: '30/07/2021' | '30/08/2022'
      alternatif?: true
    }

export type CahierDesChargesChoisiPayload = {
  projetId: string
  choisiPar: string
} & CahierDesChargesChoisiType

export class CahierDesChargesChoisi
  extends BaseDomainEvent<CahierDesChargesChoisiPayload>
  implements DomainEvent
{
  public static type: 'NouveauCahierDesChargesChoisi' = 'NouveauCahierDesChargesChoisi'
  public type = CahierDesChargesChoisi.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<CahierDesChargesChoisiPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: CahierDesChargesChoisiPayload) {
    return payload.projetId
  }
}
