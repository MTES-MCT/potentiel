import { Éliminé } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToRecoursAccordéTimelineItemProps = ({
  type,
  payload,
}:
  | Éliminé.Recours.RecoursAccordéV1Event
  | Éliminé.Recours.RecoursAccordéEvent): TimelineItemProps => {
  const date = type === 'RecoursAccordé-V1' ? payload.accordéLe : payload.dateRéponseSignée;

  return {
    date: payload.accordéLe,
    title: `Demande de recours accordée${type === 'RecoursAccordé-V1' ? '' : ` à la date du ${formatDateToText(date)}`}`,
    actor: payload.accordéPar,
    file: {
      document: Éliminé.Recours.DocumentRecours.recoursAccordé({
        identifiantProjet: payload.identifiantProjet,
        accordéLe: date,
        réponseSignée: payload.réponseSignée,
      }),

      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée de la demande de recours accordée le ${formatDateToText(date)}`,
    },
  };
};
