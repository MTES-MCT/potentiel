import { Lauréat } from '@potentiel-domain/projet';

import { ListeFournisseurs } from '@/components/pages/fournisseur/changement/ListeFournisseurs';

export const mapToFournisseurImportéTimelineItemProps = (
  record: Lauréat.Fournisseur.HistoriqueFournisseurProjetListItemReadModel,
) => {
  const { importéLe, évaluationCarboneSimplifiée, fournisseurs } =
    record.payload as Lauréat.Fournisseur.FournisseurImportéEvent['payload'];
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
          <ListeFournisseurs fournisseurs={fournisseurs ?? []} />
        </div>
      </div>
    ),
  };
};
