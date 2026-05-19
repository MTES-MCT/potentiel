import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeMainlevéeGarantiesFinancièresAccordéeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent,
): TimelineItemProps => {
  const { accordéLe, accordéPar } = event.payload;

  const réponseSignée = Lauréat.GarantiesFinancières.DocumentMainlevée.demandeAccordée(
    event.payload,
  );

  return {
    date: accordéLe,
    title: 'La demande de mainlevée des garanties financières a été accordée',
    actor: accordéPar,
    file: {
      document: réponseSignée,
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée de la demande de mainlevée des garanties financières accordée le ${formatDateToText(accordéLe)}`,
    },
  };
};
