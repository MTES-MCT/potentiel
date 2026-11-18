import { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { getMotifDemandeDélaiLabel } from '../../_helpers/getMotifDemandeDélaiLabel';

export const mapToDemandeDélaiAnnuléeTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiAnnuléeEvent | Lauréat.Délai.DemandeDélaiAnnuléeEventV1,
): TimelineItemProps => {
  const { annuléLe, annuléPar } = event.payload;
  const motif = getMotifDemandeDélaiLabel(
    event.type === 'DemandeDélaiAnnulée-V1'
      ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.formatter()
      : event.payload.motifDemande,
  );

  return {
    date: annuléLe,
    title: 'Demande de délai annulée',
    actor: annuléPar,
    details: (
      <div>
        Motif de la demande : <span className="font-semibold">{motif.toLowerCase()}</span>
      </div>
    ),
  };
};
