import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';

export const mapToChangementActionnaireEnregistréTimelineItemProps = (
  event: Lauréat.Actionnaire.ChangementActionnaireEnregistréEvent,
): TimelineItemProps => {
  const {
    enregistréLe,
    enregistréPar,
    identifiantProjet,
    pièceJustificative,
    actionnaire,
    raison,
  } = event.payload;
  return {
    date: enregistréLe,
    title: 'Actionnaire modifié',
    acteur: enregistréPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvel actionnaire : <span className="font-semibold">{actionnaire}</span>
        </div>
        <DisplayRaisonChangement raison={raison} />
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format="pdf"
          url={Routes.Document.télécharger(
            DocumentProjet.convertirEnValueType(
              identifiantProjet,
              Lauréat.Actionnaire.TypeDocumentActionnaire.pièceJustificative.formatter(),
              enregistréLe,
              pièceJustificative.format,
            ).formatter(),
          )}
        />
      </div>
    ),
  };
};
