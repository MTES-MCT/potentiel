import { Candidature } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

export const détailsFournisseursCandidatureImportésProjector = async ({
  payload,
}: Candidature.DétailsFournisseursCandidatureImportésEvent) => {
  const candidature = await findProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
  );

  if (Option.isNone(candidature)) {
    getLogger().error(`Candidature non trouvée`, {
      identifiantProjet: payload.identifiantProjet,
      fonction: 'détailsFournisseursCandidatureImportésProjector',
    });
    return;
  }
  await upsertProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    {
      ...candidature,
      fournisseurs: payload.fournisseurs,
    },
  );
};
