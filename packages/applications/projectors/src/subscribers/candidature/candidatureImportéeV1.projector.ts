import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { mapToCandidatureToUpsert } from './candidatureImportée.projector.js';

export const candidatureImportéeV1Projector = async ({
  payload,
}: Candidature.CandidatureImportéeEventV1) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  const candidatureToUpsert = await mapToCandidatureToUpsert({
    identifiantProjet,
    payload: {
      ...payload,
      fournisseurs: [],
      typologieInstallation: [],
    },
  });

  await upsertProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    candidatureToUpsert,
  );
};
