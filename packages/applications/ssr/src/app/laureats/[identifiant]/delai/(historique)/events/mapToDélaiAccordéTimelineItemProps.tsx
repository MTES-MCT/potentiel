import { Lauréat } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToDélaiAccordéTimelineItemProps = (
  event: Lauréat.Délai.DélaiAccordéEvent,
): TimelineItemProps => {
  const { accordéPar, accordéLe, nombreDeMois, dateAchèvementPrévisionnelCalculée, ...payload } =
    event.payload;

  return {
    date: accordéLe,
    title: 'Demande de délai de force majeure accordée',
    actor: accordéPar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        payload.identifiantProjet,
        Lauréat.Délai.TypeDocumentDemandeDélai.demandeAccordée.formatter(),
        accordéLe,
        payload.réponseSignée.format,
      ),
      label: 'Télécharger la réponse signée',
      ariaLabel: `Télécharger la réponse signée pour la demande de délai accordée le ${formatDateToText(accordéLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Durée : <span className="font-semibold">{nombreDeMois} mois</span>
        </div>
        <div>
          Date d'achèvement prévisionnel accordée :{' '}
          <FormattedDate
            className="font-semibold"
            date={DateTime.convertirEnValueType(dateAchèvementPrévisionnelCalculée).formatter()}
          />
        </div>
      </div>
    ),
  };
};
