import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { ListeFournisseurs } from '@/components/pages/fournisseur/changement/ListeFournisseurs';

export const mapToChangementFournisseurEnregistréTimelineItemProps = (
  record: Lauréat.Fournisseur.HistoriqueFournisseurProjetListItemReadModel,
) => {
  const {
    enregistréLe,
    enregistréPar,
    identifiantProjet,
    pièceJustificative,
    évaluationCarboneSimplifiée,
    fournisseurs,
    raison,
  } = record.payload as Lauréat.Fournisseur.ChangementFournisseurEnregistréEvent['payload'];
  return {
    date: enregistréLe,
    title: (
      <div>Fournisseur modifié par {<span className="font-semibold">{enregistréPar}</span>}</div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        {évaluationCarboneSimplifiée !== undefined && (
          <div>
            Nouvelle évaluation carbone simplifiée :{' '}
            <span className="font-semibold">{évaluationCarboneSimplifiée} kg eq CO2/kWc</span>
          </div>
        )}
        {fournisseurs && (
          <div>
            Nouvelle liste de fournisseurs :{' '}
            <ListeFournisseurs
              fournisseurs={fournisseurs.map(Lauréat.Fournisseur.Fournisseur.convertirEnValueType)}
            />{' '}
          </div>
        )}
        {raison && (
          <div>
            Raison : <span className="font-semibold">{raison}</span>
          </div>
        )}
        <DownloadDocument
          className="mb-0"
          label="Télécharger la pièce justificative"
          format="pdf"
          url={Routes.Document.télécharger(
            DocumentProjet.convertirEnValueType(
              identifiantProjet,
              Lauréat.Fournisseur.TypeDocumentFournisseur.pièceJustificative.formatter(),
              enregistréLe,
              pièceJustificative.format,
            ).formatter(),
          )}
        />
      </div>
    ),
  };
};
