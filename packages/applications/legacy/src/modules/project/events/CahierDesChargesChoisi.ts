import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '../../../core/domain';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export type CahierDesChargesChoisiPayload = {
  projetId: string;
  choisiPar: string;
} & (
  | {
      type: 'initial';
    }
  | {
      type: 'modifié';
      paruLe: AppelOffre.RéférenceCahierDesCharges.DateParutionCahierDesChargesModifié;
      alternatif?: true;
    }
);
export class CahierDesChargesChoisi
  extends BaseDomainEvent<CahierDesChargesChoisiPayload>
  implements DomainEvent
{
  public static type: 'CahierDesChargesChoisi' = 'CahierDesChargesChoisi';
  public type = CahierDesChargesChoisi.type;
  currentVersion = 1;

  constructor(props: BaseDomainEventProps<CahierDesChargesChoisiPayload>) {
    super(props);
  }

  aggregateIdFromPayload(payload: CahierDesChargesChoisiPayload) {
    return payload.projetId;
  }
}
