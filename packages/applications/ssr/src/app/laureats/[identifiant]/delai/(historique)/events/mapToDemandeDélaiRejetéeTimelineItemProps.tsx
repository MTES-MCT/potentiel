import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';
import { getMotifDemandeDélaiLabel } from '../../_helpers/getMotifDemandeDélaiLabel';

export const mapToDemandeDélaiRejetéeTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiRejetéeEvent | Lauréat.Délai.DemandeDélaiRejetéeEventV1,
): TimelineItemProps => {
  const { rejetéeLe, rejetéePar } = event.payload;
  const motif = getMotifDemandeDélaiLabel(
    event.type === 'DemandeDélaiRejetée-V1'
      ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.formatter()
      : event.payload.motifDemande,
  );
  return {
    date: rejetéeLe,
    title: 'Demande de délai rejetée',
    actor: rejetéePar,
    file: {
      document: Lauréat.Délai.DocumentDélai.demandeRejetée(event.payload),
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée de la demande de délai rejetée le ${formatDateToText(rejetéeLe)}`,
    },
    details: (
      <div>
        Motif de la demande : <span className="font-semibold">{motif.toLowerCase()}</span>
      </div>
    ),
  };
};
