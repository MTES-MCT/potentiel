import { Candidature } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const détailCandidatureImportéProjector = async ({
  payload: { identifiantProjet, détail },
}: Candidature.DétailCandidatureImportéEvent) => {
  await upsertProjection<Candidature.DétailCandidatureEntity>(
    `détail-candidature|${identifiantProjet}`,
    {
      identifiantProjet,
      statut: 'import',
      détail,
    },
  );
};
