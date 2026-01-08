import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';

export const mapToChangementNomProjetEnregistréTimelineItemProps = (
  event: Lauréat.ChangementNomProjetEnregistréEvent,
): TimelineItemProps => {
  const {
    nomProjet,
    enregistréLe,
    enregistréPar,
    raison,
    pièceJustificative,
    identifiantProjet,
    ancienNomProjet,
  } = event.payload;

  return {
    date: enregistréLe,
    title: 'Nom du projet modifié',
    acteur: enregistréPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouveau nom : <span className="font-semibold">{nomProjet}</span>
        </div>
        <div>
          Ancien nom : <span className="font-semibold">{ancienNomProjet}</span>
        </div>
        <DisplayRaisonChangement raison={raison} />
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format="pdf"
          url={Routes.Document.télécharger(
            DocumentProjet.convertirEnValueType(
              identifiantProjet,
              Lauréat.TypeDocumentNomProjet.pièceJustificative.formatter(),
              enregistréLe,
              pièceJustificative.format,
            ).formatter(),
          )}
        />{' '}
      </div>
    ),
  };
};
