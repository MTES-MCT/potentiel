import { Lauréat } from '@potentiel-domain/projet';

import { ListeFournisseurs } from '@/app/laureats/[identifiant]/fournisseur/changement/ListeFournisseurs';

export const mapToFournisseurImportéTimelineItemProps = (
  record: Lauréat.Fournisseur.FournisseurImportéEvent,
) => {
  const { importéLe, évaluationCarboneSimplifiée, fournisseurs } = record.payload;
  return {
    date: importéLe,
    title: (
      <div className="flex flex-col gap-2">
        Candidature :
        <div>
          Évaluation carbone simplifiée :{' '}
          <span className="font-semibold">{évaluationCarboneSimplifiée} kg eq CO2/kWc</span>
        </div>
        <div>
          Fournisseurs :
          <ListeFournisseurs
            fournisseurs={
              fournisseurs.map(Lauréat.Fournisseur.Fournisseur.convertirEnValueType) ?? []
            }
          />
        </div>
      </div>
    ),
  };
};
