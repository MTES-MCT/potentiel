import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const attestationConformitéTransmiseProjector = async ({
  payload: {
    identifiantProjet,
    attestation,
    date,
    preuveTransmissionAuCocontractant,
    dateTransmissionAuCocontractant,
    utilisateur,
  },
}: Lauréat.Achèvement.AttestationConformitéTransmiseEvent) => {
  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${identifiantProjet}`,
    {
      estAchevé: true,
      réel: {
        date: dateTransmissionAuCocontractant,
        attestationConformité: { format: attestation.format, transmiseLe: date },
        preuveTransmissionAuCocontractant: {
          format: preuveTransmissionAuCocontractant.format,
          transmiseLe: dateTransmissionAuCocontractant,
        },
        dernièreMiseÀJour: { date, utilisateur },
      },
    },
  );
};
