import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { HistoriqueItem } from '@/utils/historique/HistoriqueItem.type';

export const mapToAbandonAccordéTimelineItemProps: HistoriqueItem<
  Lauréat.Abandon.AbandonAccordéEvent
> = ({ event, withLink }) => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = event.payload;

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Abandon.TypeDocumentAbandon.abandonAccordé.formatter(),
    accordéLe,
    format,
  ).formatter();

  return {
    date: accordéLe,
    title: (
      <div>
        {withLink ? (
          <Link href={Routes.Abandon.détail(identifiantProjet)}>Demande d'abandon accordée</Link>
        ) : (
          `Demande d'abandon accordée`
        )}{' '}
        par {<span className="font-semibold">{accordéPar}</span>}
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
