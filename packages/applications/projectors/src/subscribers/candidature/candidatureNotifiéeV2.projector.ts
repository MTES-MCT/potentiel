import { Candidature } from '@potentiel-domain/candidature';

import { updateOneProjection } from '../../infrastructure/updateOneProjection';

export const candidatureNotifiéeV2Projector = async ({
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
