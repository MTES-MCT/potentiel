import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';
import { Historique } from '@potentiel-domain/historique';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToChangementPuissanceRejetéTimelineItemProps = (
  record: Historique.HistoriquePuissanceProjetListItemReadModel,
) => {
  const {
    rejetéLe,
    rejetéPar,
    identifiantProjet,
    réponseSignée: { format },
    estUneDécisionDEtat,
  } = record.payload as Lauréat.Puissance.ChangementPuissanceRejetéEvent['payload'];

  const réponseSignée = DocumentProjet.convertirEnValueType(
    identifiantProjet,
    Lauréat.Puissance.TypeDocumentPuissance.changementRejeté.formatter(),
    rejetéLe,
    format,
  ).formatter();

  return {
    date: rejetéLe,
    title: (
      <div>
        Changement de puissance rejeté par {<span className="font-semibold">{rejetéPar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Fait suite à une décision de l'État :{' '}
          <span className="font-semibold">{estUneDécisionDEtat ? 'Oui' : 'Non'}</span>
        </div>
        <DownloadDocument
          className="mb-0"
          label="Télécharger la réponse signée"
          format="pdf"
          url={Routes.Document.télécharger(réponseSignée)}
        />
      </div>
    ),
  };
};
