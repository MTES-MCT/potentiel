import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const attestationConformitéModifiéeProjector = async ({
  payload,
}: Lauréat.Achèvement.AttestationConformitéModifiéeEvent) => {
  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${payload.identifiantProjet}`,
    {
      réel: {
        attestationConformité: { format: payload.attestation.format, date: payload.date },
        preuveTransmissionAuCocontractant: {
          format: payload.preuveTransmissionAuCocontractant.format,
          date: payload.dateTransmissionAuCocontractant,
        },
        dernièreMiseÀJour: { date: payload.date, utilisateur: payload.utilisateur },
      },
    },
  );
};
