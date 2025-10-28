import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const changementFournisseurEnregistréProjector = async ({
  payload: {
    identifiantProjet,
    évaluationCarboneSimplifiée,
    fournisseurs,
    raison,
    pièceJustificative,
    enregistréLe,
    enregistréPar,
  },
}: Lauréat.Fournisseur.ChangementFournisseurEnregistréEvent) => {
  await updateOneProjection<Lauréat.Fournisseur.FournisseurEntity>(
    `fournisseur|${identifiantProjet}`,
    {
      ...(évaluationCarboneSimplifiée !== undefined && { évaluationCarboneSimplifiée }),
      ...(fournisseurs && { fournisseurs }),
      miseÀJourLe: enregistréLe,
    },
  );

  await upsertProjection<Lauréat.Fournisseur.ChangementFournisseurEntity>(
    `changement-fournisseur|${identifiantProjet}#${enregistréLe}`,
    {
      identifiantProjet,
      changement: {
        fournisseurs,
        évaluationCarboneSimplifiée,
        enregistréLe,
        raison,
        pièceJustificative,
        enregistréPar,
      },
    },
  );
};
