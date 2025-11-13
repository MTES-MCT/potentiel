import { Candidature } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const détailsFournisseursCandidatureImportésProjector = async ({
  payload,
}: Candidature.DétailsFournisseursCandidatureImportésEvent) => {
  await updateOneProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    {
      fournisseurs: payload.fournisseurs,
    },
  );
};
