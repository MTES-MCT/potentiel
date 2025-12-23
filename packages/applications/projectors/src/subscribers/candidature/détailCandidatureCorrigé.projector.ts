import { Candidature } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const détailCandidatureCorrigéProjector = async ({
  payload: { identifiantProjet, détail },
}: Candidature.DétailCandidatureCorrigéEvent) => {
  await upsertProjection<Candidature.DétailCandidatureEntity>(
    `détail-candidature|${identifiantProjet}`,
    {
      identifiantProjet,
      statut: 'correction',
      détail,
    },
  );
};
