import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { Link } from '@/components/atoms/LinkNoPrefetch';

import { HistoriqueItem } from '../../../HistoriqueItem.type';

export const mapToConfirmationAbandonDemandéeTimelineItemProps: HistoriqueItem<
  Lauréat.Abandon.ConfirmationAbandonDemandéeEvent
> = ({ event, withLink }) => {
  const {
    confirmationDemandéeLe,
    confirmationDemandéePar,
    identifiantProjet,
    réponseSignée: { format },
  } = event.payload;

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Abandon.TypeDocumentAbandon.abandonÀConfirmer.formatter(),
    confirmationDemandéeLe,
    format,
  ).formatter();

  return {
    date: confirmationDemandéeLe,
    title: (
      <div>
        {withLink ? (
          <Link href={Routes.Abandon.détail(identifiantProjet)}>
            Confirmation demandée pour la demande d'abandon
          </Link>
        ) : (
          `Confirmation demandée pour la demande d'abandon`
        )}
        par {<span className="font-semibold">{confirmationDemandéePar}</span>}
      </div>
    ),
    content: (
      <>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format="pdf"
          url={Routes.Document.télécharger(réponseSignée)}
        />
      </>
    ),
  };
};
