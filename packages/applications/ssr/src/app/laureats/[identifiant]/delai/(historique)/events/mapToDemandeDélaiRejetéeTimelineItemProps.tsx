import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToDemandeDélaiRejetéeTimelineItemProps = (
  event: Lauréat.Délai.DemandeDélaiRejetéeEvent,
): TimelineItemProps => {
  const { rejetéeLe, rejetéePar } = event.payload;

  return {
    date: rejetéeLe,
    title: 'Demande de délai rejetée',
    actor: rejetéePar,
    file: {
      document: Lauréat.Délai.DocumentDélai.délaiRejeté(event.payload),
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée de la demande de délai rejetée le ${formatDateToText(rejetéeLe)}`,
    },
  };
};
