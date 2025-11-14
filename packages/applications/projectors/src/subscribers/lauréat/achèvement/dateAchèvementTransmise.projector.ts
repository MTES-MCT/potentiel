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
        attestationConformité: {
          format: payload.attestation.format,
          date: payload.transmiseLe,
        },
        /**
         * TODO
         */
        preuveTransmissionAuCocontractant: {
          format: payload.attestation.format,
          date: payload.dateAchèvement,
        },
        dernièreMiseÀJour: {
          date: payload.transmiseLe,
          utilisateur: payload.transmisePar,
        },
      },
    },
  );
};
