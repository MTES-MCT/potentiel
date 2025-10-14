import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { mapToCandidatureToUpsert } from './candidatureCorrigée.projector';

export const candidatureCorrigéeV1Projector = async ({
  payload,
}: Candidature.CandidatureCorrigéeEventV1) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  const appelOffres = await findProjection<AppelOffre.AppelOffreEntity>(
    `appel-offre|${identifiantProjet.appelOffre}`,
  );
  if (Option.isNone(appelOffres)) {
    throw new Error("Appel d'offres non trouvé");
  }

  const candidature = await findProjection<Candidature.CandidatureEntity>(
    `candidature|${identifiantProjet.formatter()}`,
  );

  const candidatureToUpsert = mapToCandidatureToUpsert({
    payload: {
      ...payload,
      fournisseurs: Option.isSome(candidature) ? candidature.fournisseurs : [],
      typologieDuProjet: Option.isSome(candidature) ? candidature.typologieDuProjet : [],
    },
    candidature,
    identifiantProjet,
    appelOffres,
  });

  await upsertProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    candidatureToUpsert,
  );
};
