import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { DateTime } from '@potentiel-domain/common';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToDélaiAccordéTimelineItemProps = (
  délaiAccordé: Lauréat.Délai.DélaiAccordéEvent,
) => {
  const { accordéLe, nombreDeMois, dateAchèvementPrévisionnelCalculée, ...payload } =
    délaiAccordé.payload;

  return {
    date: accordéLe,
    title: <div>Demande de délai exceptionnel accordée par l'administration</div>,
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

// const getTitleFromRaison = (raison: Lauréat.Délai.DélaiAccordéEvent['payload']['raison']) =>
//   match(raison)
//     .with('demande', () => `Demande de délai exceptionnel accordée par l'administration`)
//     .with('cdc-18-mois', () => (
//       <>
//         Attribution d'un délai supplémentaire prévu dans le{' '}
//         <span className="font-semibold">cahier des charges rétroactif du 30/08/2022</span>
//       </>
//     ))
//     .with('covid', () => (
//       <>
//         Attribution d'un délai supplémentaire dû à la{' '}
//         <span className="font-semibold">crise du COVID</span>
//       </>
//     ))
//     .exhaustive();
