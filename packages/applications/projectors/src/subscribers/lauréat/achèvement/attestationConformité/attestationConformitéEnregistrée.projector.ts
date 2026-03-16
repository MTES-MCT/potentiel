import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const attestationConformitéEnregistréeProjector = async ({
  payload: {
    identifiantProjet,
    attestationConformité: { format },
    enregistréeLe,
    enregistréePar,
  },
}: Lauréat.Achèvement.AttestationConformitéEnregistréeEvent) => {
  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${identifiantProjet}`,
    {
      réel: {
        dernièreMiseÀJour: { date: enregistréeLe, utilisateur: enregistréePar },
        attestationConformité: { format, transmiseLe: enregistréeLe },
      },
    },
  );
};
