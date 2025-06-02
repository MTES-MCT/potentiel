import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const fournisseurImportéProjector = async ({
  payload: { identifiantProjet, évaluationCarboneSimplifiée, importéLe },
}: Lauréat.Fournisseur.FournisseurImportéEvent) => {
  await upsertProjection<Lauréat.Fournisseur.FournisseurEntity>(
    `fournisseur|${identifiantProjet}`,
    {
      identifiantProjet,
      évaluationCarboneSimplifiée,
      details: [],
      misÀJourLe: importéLe,
    },
  );
};
