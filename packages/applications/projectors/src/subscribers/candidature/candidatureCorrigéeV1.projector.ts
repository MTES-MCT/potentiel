import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { mapToCandidatureToUpsert } from './candidatureCorrigée.projector';

export const candidatureCorrigéeV1Projector = async ({
  payload,
}: Candidature.CandidatureCorrigéeEventV1) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  const candidature = await findProjection<Candidature.CandidatureEntity>(
    `candidature|${identifiantProjet.formatter()}`,
  );

  const candidatureToUpsert = mapToCandidatureToUpsert({
    payload: {
      ...payload,
      fournisseurs: Option.isSome(candidature) ? candidature.fournisseurs : [],
      typologieInstallation: Option.isSome(candidature) ? candidature.typologieInstallation : [],
    },
    candidature,
    identifiantProjet,
  });

  await upsertProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    candidatureToUpsert,
  );
};
