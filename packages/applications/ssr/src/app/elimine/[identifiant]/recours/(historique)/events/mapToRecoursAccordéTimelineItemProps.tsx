import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';
import { Éliminé } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToRecoursAccordéTimelineItemProps = (
  recoursAccordé: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const {
    accordéLe,
    accordéPar,
    identifiantProjet,
    réponseSignée: { format },
  } = recoursAccordé.payload as Éliminé.Recours.RecoursAccordéEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Éliminé.Recours.TypeDocumentRecours.recoursAccordé.formatter(),
    accordéLe,
    format,
  ).formatter();

  return {
    date: accordéLe,
    title: (
      <div>
        Demande de recours accordée <TimelineItemUserEmail email={accordéPar} />
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
