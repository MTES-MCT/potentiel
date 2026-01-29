import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const attestationConformitéModifiéeProjector = async ({
  payload: {
    dateTransmissionAuCocontractant,
    identifiantProjet,
    date,
    utilisateur,
    preuveTransmissionAuCocontractant,
    attestation,
  },
}: Lauréat.Achèvement.AttestationConformitéModifiéeEvent) => {
  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${identifiantProjet}`,
    {
      réel: {
        date: dateTransmissionAuCocontractant,
        dernièreMiseÀJour: { date, utilisateur },
        ...(preuveTransmissionAuCocontractant && {
          preuveTransmissionAuCocontractant: {
            format: preuveTransmissionAuCocontractant.format,
            transmiseLe: dateTransmissionAuCocontractant,
          },
        }),
        ...(attestation && {
          attestationConformité: { format: attestation.format, transmiseLe: date },
        }),
      },
    },
  );
};
