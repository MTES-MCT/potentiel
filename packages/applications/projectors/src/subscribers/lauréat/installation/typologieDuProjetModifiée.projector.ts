import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const typologieDuProjetModifiéeProjector = async ({
  payload: { identifiantProjet, typologieDuProjet, modifiéeLe },
}: Lauréat.Installation.TypologieDuProjetModifiéeEvent) => {
  await updateOneProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
    {
      identifiantProjet,
      typologieDuProjet,
      misÀJourLe: modifiéeLe,
    },
  );
};
