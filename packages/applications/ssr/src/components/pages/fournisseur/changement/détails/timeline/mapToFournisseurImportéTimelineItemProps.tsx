import { Lauréat } from '@potentiel-domain/projet';

import { ListeFournisseurs } from '../../ListeFournisseurs';

import { FournisseurHistoryRecord } from '.';

export const mapToFournisseurImportéTimelineItemProps = (record: FournisseurHistoryRecord) => {
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
