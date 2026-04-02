import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers/formatDateToText';

export const mapToDemandeMainlevéeGarantiesFinancièresRejetéeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent,
): TimelineItemProps => {
  const { rejetéLe, rejetéPar } = event.payload;

  const document = Lauréat.GarantiesFinancières.DocumentMainlevée.demandeRejetée(event.payload);

  return {
    date: rejetéLe,
    title: 'La demande de mainlevée des garanties financières a été rejetée',
    actor: rejetéPar,
    file: {
      document,
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée de la demande de mainlevée des garanties financières rejetée le ${formatDateToText(rejetéLe)}`,
    },
  };
};
