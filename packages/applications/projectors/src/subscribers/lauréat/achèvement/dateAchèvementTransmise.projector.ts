import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const dateAchèvementTransmiseProjector = async ({
  payload,
}: Lauréat.Achèvement.DateAchèvementTransmiseEvent) => {
  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${payload.identifiantProjet}`,
    {
      estAchevé: true,
      réel: {
        date: payload.dateAchèvement,
        attestationConformité: {
          format: payload.attestation.format,
          transmiseLe: payload.transmiseLe,
        },
        dernièreMiseÀJour: {
          date: payload.transmiseLe,
          utilisateur: payload.transmisePar,
        },
      },
    },
  );
};
