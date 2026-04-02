import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const attestationConformitéModifiéeProjector = async ({
  payload: { identifiantProjet, attestation, modifiéeLe, modifiéePar },
}: Lauréat.Achèvement.AttestationConformitéModifiéeEvent) => {
  await updateOneProjection<Lauréat.Achèvement.AchèvementEntity>(
    `achèvement|${identifiantProjet}`,
    {
      réel: {
        attestationConformité: { format: attestation.format, transmiseLe: modifiéeLe },
        dernièreMiseÀJour: { date: modifiéeLe, utilisateur: modifiéePar },
      },
    },
  );
};
