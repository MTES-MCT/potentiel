import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const attestationConformitéModifiéeProjector = async ({
  payload,
}: Lauréat.Achèvement.AttestationConformitéModifiéeEvent) => {
  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${payload.identifiantProjet}`,
    {
      réel: {
        date: payload.dateTransmissionAuCocontractant,
        attestationConformité: { format: payload.attestation.format, transmiseLe: payload.date },
        preuveTransmissionAuCocontractant: {
          format: payload.preuveTransmissionAuCocontractant.format,
          transmiseLe: payload.dateTransmissionAuCocontractant,
        },
        dernièreMiseÀJour: { date: payload.date, utilisateur: payload.utilisateur },
      },
    },
  );
};
