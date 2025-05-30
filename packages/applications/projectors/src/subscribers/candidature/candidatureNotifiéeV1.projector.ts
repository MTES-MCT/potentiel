import { Candidature } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const candidatureNotifiéeV1Projector = async ({
  payload,
}: Candidature.CandidatureNotifiéeEventV1) => {
  await updateOneProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    {
      estNotifiée: true,
      notification: {
        notifiéeLe: payload.notifiéeLe,
        notifiéePar: payload.notifiéePar,
        validateur: payload.validateur,
      },
    },
  );
};
