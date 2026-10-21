import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToMainlevéeGarantiesFinancièresAccordéeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresAccordéeEvent,
): TimelineItemProps => {
  const { accordéLe, accordéPar, motif } = event.payload;

  const réponseSignée = Lauréat.GarantiesFinancières.DocumentMainlevée.demandeAccordée(
    event.payload,
  );

  return {
    date: accordéLe,
    title: `Mainlevée des garanties financières accordée${motif === 'projet-abandonné' && " avec l'abandon du projet"}`,
    actor: accordéPar,
    file: {
      document: réponseSignée,
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée${motif === 'projet-abandonné' && " de l'abandon accordé avev mainlevée des garanties financières"} en date du ${formatDateToText(accordéLe)}`,
    },
  };
};
