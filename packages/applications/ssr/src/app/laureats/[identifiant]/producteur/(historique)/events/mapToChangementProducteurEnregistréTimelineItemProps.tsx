import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';

export const mapToChangementProducteurEnregistréTimelineItemProps = (
  event: Lauréat.Producteur.ChangementProducteurEnregistréEvent,
): TimelineItemProps => {
  const { enregistréLe, enregistréPar, identifiantProjet, pièceJustificative, producteur, raison } =
    event.payload;
  return {
    date: enregistréLe,
    title: 'Producteur modifié',
    acteur: enregistréPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouveau producteur : <span className="font-semibold">{producteur}</span>
        </div>
        <DisplayRaisonChangement raison={raison} />
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format="pdf"
          url={Routes.Document.télécharger(
            DocumentProjet.convertirEnValueType(
              identifiantProjet,
              Lauréat.Producteur.TypeDocumentProducteur.pièceJustificative.formatter(),
              enregistréLe,
              pièceJustificative.format,
            ).formatter(),
          )}
        />
      </div>
    ),
  };
};
