import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

import { mapToCandidatureToUpsert } from './candidatureImportée.projector';

export const candidatureImportéeV1Projector = async ({
  payload,
}: Candidature.CandidatureImportéeEventV1) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  const appelOffres = await findProjection<AppelOffre.AppelOffreEntity>(
    `appel-offre|${identifiantProjet.appelOffre}`,
  );
  if (Option.isNone(appelOffres)) {
    throw new Error("Appel d'offres non trouvé");
  }
  const candidatureToUpsert = mapToCandidatureToUpsert({
    identifiantProjet,
    payload: {
      ...payload,
      fournisseurs: [],
      typologieInstallation: [],
    },
    appelOffres,
  });

  await upsertProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    candidatureToUpsert,
  );
};
