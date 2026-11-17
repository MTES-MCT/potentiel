import { Lauréat } from '@potentiel-domain/projet';

import { getMotifDemandeDélaiLabel } from '../../_helpers/getMotifDemandeDélaiLabel';

export const mapToDemandeDélaiSuppriméeTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiSuppriméeEvent | Lauréat.Délai.DemandeDélaiSuppriméeEventV1,
) => {
  const { suppriméLe } = event.payload;
  const motif = getMotifDemandeDélaiLabel(
    event.type === 'DemandeDélaiSupprimée-V1'
      ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.formatter()
      : event.payload.motifDemande,
  );

  return {
    date: suppriméLe,
    title: 'Demande de délai supprimée',
    reason: 'Abandon accordé',
    details: (
      <div>
        Motif de la demande de délai : <span className="font-semibold">{motif.toLowerCase()}</span>
      </div>
    ),
  };
};
