import { Candidature } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { mapToCandidatureToUpsert } from './candidatureImportée.projector';

export const candidatureImportéeV1Projector = async ({
  payload,
}: Candidature.CandidatureImportéeEventV1) => {
  const candidatureToUpsert = mapToCandidatureToUpsert({
    ...payload,
    fournisseurs: [],
    typologieInstallation: [],
  });

  await upsertProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    candidatureToUpsert,
  );
};
