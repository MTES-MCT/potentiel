import { Lauréat } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToDemandeMainlevéeGarantiesFinancièresAccordéeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent,
): TimelineItemProps => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = event.payload;

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.GarantiesFinancières.TypeDocumentRéponseMainlevée.courrierRéponseMainlevéeAccordéeValueType.formatter(),
    accordéLe,
    format,
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
