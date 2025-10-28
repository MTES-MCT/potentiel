import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const fournisseurModifiéProjector = async ({
  payload: { identifiantProjet, évaluationCarboneSimplifiée, fournisseurs, modifiéLe },
}: Lauréat.Fournisseur.FournisseurModifiéEvent) => {
  await updateOneProjection<Lauréat.Fournisseur.FournisseurEntity>(
    `fournisseur|${identifiantProjet}`,
    {
      ...(évaluationCarboneSimplifiée !== undefined && { évaluationCarboneSimplifiée }),
      ...(fournisseurs && { fournisseurs }),
      miseÀJourLe: modifiéLe,
    },
  );
};
