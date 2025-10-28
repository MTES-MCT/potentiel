import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const fournisseurImportéProjector = async ({
  payload: { identifiantProjet, évaluationCarboneSimplifiée, importéLe, fournisseurs },
}: Lauréat.Fournisseur.FournisseurImportéEvent) => {
  await upsertProjection<Lauréat.Fournisseur.FournisseurEntity>(
    `fournisseur|${identifiantProjet}`,
    {
      identifiantProjet,
      évaluationCarboneSimplifiée,
      fournisseurs,
      miseÀJourLe: importéLe,
    },
  );
};
