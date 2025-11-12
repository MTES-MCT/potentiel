import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDélaiAccordéTimelineItemProps = (
  event: Lauréat.Délai.DélaiAccordéEvent,
): TimelineItemProps => {
  const { accordéPar, accordéLe, nombreDeMois, dateAchèvementPrévisionnelCalculée, ...payload } =
    event.payload;

  return {
    date: accordéLe,
    title: 'Demande de délai exceptionnel accordée',
    acteur: accordéPar,
    content: (
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
        <DownloadDocument
          className="mb-0"
          label="Télécharger la réponse signée"
          format="pdf"
          url={Routes.Document.télécharger(
            DocumentProjet.convertirEnValueType(
              payload.identifiantProjet,
              Lauréat.Délai.TypeDocumentDemandeDélai.demandeAccordée.formatter(),
              accordéLe,
              payload.réponseSignée.format,
            ).formatter(),
          )}
        />
      </div>
    ),
  };
};
