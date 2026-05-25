import type { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const achèvementModifiéProjector = async ({
  payload: {
    identifiantProjet,
    date,
    dateTransmissionAuCocontractant,
    utilisateur,
    attestation,
    rapportAssocié,
    preuveTransmissionAuCocontractant,
  },
}: Lauréat.Achèvement.AchèvementModifiéEvent) => {
  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${identifiantProjet}`,
    {
      réel: {
        date: dateTransmissionAuCocontractant,
        dernièreMiseÀJour: { date, utilisateur },
        ...(attestation && {
          attestationConformité: { format: attestation.format, transmiseLe: date },
        }),
        ...(rapportAssocié && {
          rapportAssocié: {
            format: rapportAssocié.format,
            transmisLe: date,
          },
        }),
        ...(preuveTransmissionAuCocontractant && {
          preuveTransmissionAuCocontractant: {
            format: preuveTransmissionAuCocontractant.format,
            transmiseLe: dateTransmissionAuCocontractant,
          },
        }),
      },
    },
  );
};
