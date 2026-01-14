import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { ListeFournisseurs } from '@/app/laureats/[identifiant]/fournisseur/changement/ListeFournisseurs';
import { TimelineItemProps } from '@/components/organisms/timeline';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';
import { formatDateToText } from '@/app/_helpers';

export const mapToChangementFournisseurEnregistréTimelineItemProps = (
  event: Lauréat.Fournisseur.ChangementFournisseurEnregistréEvent,
): TimelineItemProps => {
  const {
    enregistréLe,
    enregistréPar,
    identifiantProjet,
    pièceJustificative,
    évaluationCarboneSimplifiée,
    fournisseurs,
    raison,
  } = event.payload;
  return {
    date: enregistréLe,
    title: 'Fournisseur modifié',
    actor: enregistréPar,
    file: {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Fournisseur.TypeDocumentFournisseur.pièceJustificative.formatter(),
        enregistréLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif joint au changement de fournisseur en date du ${formatDateToText(enregistréLe)}`,
    },
    details: (
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
      </div>
    ),
  };
};
