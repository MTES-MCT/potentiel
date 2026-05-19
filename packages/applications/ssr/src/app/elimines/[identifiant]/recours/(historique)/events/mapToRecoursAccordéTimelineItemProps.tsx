import { Éliminé } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToRecoursAccordéTimelineItemProps = (
  event: Éliminé.Recours.RecoursAccordéEvent,
): TimelineItemProps => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = event.payload;

  return {
    date: accordéLe,
    title: 'Demande de recours accordée',
    actor: accordéPar,
    file: {
      document: Éliminé.Recours.DocumentRecours.recoursAccordé({
        identifiantProjet,
        accordéLe,
        réponseSignée: {
          format,
        },
      }),

      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée de la demande de recours accordée le ${formatDateToText(accordéLe)}`,
    },
  };
};
