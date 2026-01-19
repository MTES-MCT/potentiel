import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { ListeFournisseurs } from '@/app/laureats/[identifiant]/fournisseur/changement/ListeFournisseurs';
import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

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
    actor: modifiéPar,
    file: pièceJustificative && {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Fournisseur.TypeDocumentFournisseur.pièceJustificative.formatter(),
        modifiéLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif du changement de fournisseur enregistré le ${formatDateToText(modifiéLe)}`,
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
      </div>
    ),
    reason: raison,
  };
};
