import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const attestationConformitéTransmiseProjector = async ({
  payload: {
    identifiantProjet,
    attestation,
    date,
    preuveTransmissionAuCocontractant,
    dateTransmissionAuCocontractant,
    utilisateur,
  },
}: Lauréat.Achèvement.AttestationConformité.AttestationConformitéTransmiseEvent) => {
  await upsertProjection<Lauréat.Achèvement.AttestationConformité.AchèvementEntity>(
    `achèvement|${identifiantProjet}`,
    {
      identifiantProjet,
      attestationConformité: { format: attestation.format, date },
      preuveTransmissionAuCocontractant: {
        format: preuveTransmissionAuCocontractant.format,
        date: dateTransmissionAuCocontractant,
      },
      dernièreMiseÀJour: { date, utilisateur },
    },
  );
};
