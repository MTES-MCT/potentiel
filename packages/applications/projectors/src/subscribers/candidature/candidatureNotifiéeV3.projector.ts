import { Candidature } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const candidatureNotifiéeV3Projector = async ({
  payload,
}: Candidature.CandidatureNotifiéeEvent) => {
  await updateOneProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    {
      estNotifiée: true,
      notification: {
        notifiéeLe: payload.notifiéeLe,
        notifiéePar: payload.notifiéePar,
        validateur: payload.validateur,
        attestation: {
          généréeLe: payload.notifiéeLe,
          format: payload.attestation.format,
        },
      },
    },
  );
};
