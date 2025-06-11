import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const évaluationCarboneModifiéeProjector = async ({
  payload: { identifiantProjet, évaluationCarboneSimplifiée },
}: Lauréat.Fournisseur.ÉvaluationCarboneModifiéeEvent) => {
  await updateOneProjection<Lauréat.Fournisseur.FournisseurEntity>(
    `fournisseur|${identifiantProjet}`,
    {
      identifiantProjet,
      évaluationCarboneSimplifiée,
    },
  );
};
