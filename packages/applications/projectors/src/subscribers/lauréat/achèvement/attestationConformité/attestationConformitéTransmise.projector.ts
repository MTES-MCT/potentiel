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
        attestationConformité: { format: attestation.format, date },
        preuveTransmissionAuCocontractant: {
          format: preuveTransmissionAuCocontractant.format,
          date: dateTransmissionAuCocontractant,
        },
        dernièreMiseÀJour: { date, utilisateur },
      },
    },
  );
};
