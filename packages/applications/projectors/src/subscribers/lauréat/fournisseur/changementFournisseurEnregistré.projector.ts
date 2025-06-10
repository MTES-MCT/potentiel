import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const changementFournisseurEnregistréProjector = async ({
  payload: { identifiantProjet, évaluationCarboneSimplifiée, fournisseurs, enregistréLe },
}: Lauréat.Fournisseur.ChangementFournisseurEnregistréEvent) => {
  await updateOneProjection<Lauréat.Fournisseur.FournisseurEntity>(
    `fournisseur|${identifiantProjet}`,
    {
      évaluationCarboneSimplifiée,
      fournisseurs,
      misÀJourLe: enregistréLe,
    },
  );
};
