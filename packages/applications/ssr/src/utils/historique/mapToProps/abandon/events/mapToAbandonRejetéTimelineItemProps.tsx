import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { HistoriqueItem } from '@/utils/historique/HistoriqueItem.type';

export const mapToAbandonRejetéTimelineItemProps: HistoriqueItem<
  Lauréat.Abandon.AbandonRejetéEvent
> = ({ event, withLink }) => {
  const {
    rejetéLe,
    rejetéPar,
    réponseSignée: { format },
    identifiantProjet,
  } = event.payload;

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Abandon.TypeDocumentAbandon.abandonRejeté.formatter(),
    rejetéLe,
    format,
  ).formatter();

  return {
    date: rejetéLe,
    title: (
      <div>
        {withLink ? (
          <Link href={Routes.Abandon.détail(identifiantProjet)}>Demande d'abandon rejetée</Link>
        ) : (
          `Demande d'abandon rejetée`
        )}{' '}
        par {<span className="font-semibold">{rejetéPar}</span>}
      </div>
    ),
    content: (
      <DownloadDocument
        className="mb-0"
        label="Télécharger la réponse signée"
        format="pdf"
        url={Routes.Document.télécharger(réponseSignée)}
      />
    ),
  };
};
