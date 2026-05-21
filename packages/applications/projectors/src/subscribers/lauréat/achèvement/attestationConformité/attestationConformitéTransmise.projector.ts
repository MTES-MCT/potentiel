import type { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const attestationConformitéTransmiseProjector = async ({
  type,
  payload,
}:
  | Lauréat.Achèvement.AttestationConformitéTransmiseEventV1
  | Lauréat.Achèvement.AttestationConformitéTransmiseEvent) => {
  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${payload.identifiantProjet}`,
    {
      estAchevé: true,
      réel: {
        date: payload.dateTransmissionAuCocontractant,
        attestationConformité: { format: payload.attestation.format, transmiseLe: payload.date },
        ...(type === 'AttestationConformitéTransmise-V2' && {
          rapportAssocié: { format: payload.rapportAssocié.format, transmisLe: payload.date },
        }),
        preuveTransmissionAuCocontractant: {
          format: payload.preuveTransmissionAuCocontractant.format,
          transmiseLe: payload.dateTransmissionAuCocontractant,
        },
        dernièreMiseÀJour: { date: payload.date, utilisateur: payload.utilisateur },
      },
    },
  );
};
