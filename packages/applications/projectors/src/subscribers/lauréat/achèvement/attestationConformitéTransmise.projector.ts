import { Achèvement } from '@potentiel-domain/laureat';
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
}: Achèvement.AttestationConformitéTransmiseEvent) => {
  await upsertProjection<Achèvement.AchèvementEntity>(`achevement|${identifiantProjet}`, {
    identifiantProjet,
    attestationConformité: { format: attestation.format, date },
    preuveTransmissionAuCocontractant: {
      format: preuveTransmissionAuCocontractant.format,
      date: dateTransmissionAuCocontractant,
    },
    dernièreMiseÀJour: { date, utilisateur },
  });
};
