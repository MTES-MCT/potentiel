import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const candidatureImportéeProjector = async ({
  payload: { identifiantProjet, nomCandidat, importéLe },
}: Candidature.CandidatureImportéeEvent) => {
  await upsertProjection<Lauréat.Producteur.ProducteurEntity>(`producteur|${identifiantProjet}`, {
    identifiantProjet,
    nom: nomCandidat,
    misÀJourLe: importéLe,
  });
};
