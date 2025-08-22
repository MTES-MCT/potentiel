import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToDélaiAccordéTimelineItemProps = (
  délaiAccordé: Lauréat.Délai.DélaiAccordéEvent,
) => {
  const { accordéPar, accordéLe, nombreDeMois, dateAchèvementPrévisionnelCalculée, ...payload } =
    délaiAccordé.payload;

  return {
    date: accordéLe,
    title: (
      <div>
        Demande de délai exceptionnel accordée par{' '}
        <span className="font-semibold">{accordéPar}</span>
      </div>
    ),
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
