import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { appelsOffreData } from '@potentiel-domain/inmemory-referential';

import { mapToCandidatureToUpsert } from './candidatureImportée.projector';

export const candidatureImportéeV1Projector = async ({
  payload,
}: Candidature.CandidatureImportéeEventV1) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  const appelOffres = appelsOffreData.find((ao) => ao.id === identifiantProjet.appelOffre);
  if (!appelOffres) {
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
