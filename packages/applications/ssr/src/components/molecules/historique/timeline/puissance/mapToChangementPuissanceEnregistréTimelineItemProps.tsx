import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Historique } from '@potentiel-domain/historique';
import { Puissance } from '@potentiel-domain/laureat';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';

export const mapToChangementPuissanceEnregistréTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { enregistréLe, enregistréPar, identifiantProjet, pièceJustificative, puissance, raison } =
    modification.payload as Puissance.ChangementPuissanceEnregistréEvent['payload'];
  return {
    date: enregistréLe,
    title: (
      <div>Puissance modifiée par {<span className="font-semibold">{enregistréPar}</span>}</div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance : <span className="font-semibold">{puissance} MW</span>
        </div>
        {raison && (
          <div>
            Raison : <span className="font-semibold">{raison}</span>
          </div>
        )}
        {pièceJustificative && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format="pdf"
            url={Routes.Document.télécharger(
              DocumentProjet.convertirEnValueType(
                identifiantProjet,
                Puissance.TypeDocumentPuissance.pièceJustificative.formatter(),
                enregistréLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
      </div>
    ),
  };
};
