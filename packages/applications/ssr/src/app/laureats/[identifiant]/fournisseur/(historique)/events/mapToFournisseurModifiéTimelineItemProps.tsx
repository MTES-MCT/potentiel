import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { ListeFournisseurs } from '@/app/laureats/[identifiant]/fournisseur/changement/ListeFournisseurs';
import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';

export const mapToFournisseurModifiéTimelineItemProps = (
  event: Lauréat.Fournisseur.FournisseurModifiéEvent,
): TimelineItemProps => {
  const {
    identifiantProjet,
    pièceJustificative,
    modifiéLe,
    modifiéPar,
    évaluationCarboneSimplifiée,
    fournisseurs,
    raison,
  } = event.payload;
  return {
    date: modifiéLe,
    title: 'Fournisseur modifié',
    acteur: modifiéPar,
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
        <DisplayRaisonChangement raison={raison} />
        {pièceJustificative && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format="pdf"
            url={Routes.Document.télécharger(
              DocumentProjet.convertirEnValueType(
                identifiantProjet,
                Lauréat.Fournisseur.TypeDocumentFournisseur.pièceJustificative.formatter(),
                modifiéLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
      </div>
    ),
  };
};
