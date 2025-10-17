import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const typologieInstallationModifiéeProjector = async ({
  payload: { identifiantProjet, typologieInstallation, modifiéeLe },
}: Lauréat.Installation.TypologieInstallationModifiéeEvent) => {
  await updateOneProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
    {
      identifiantProjet,
      typologieInstallation,
      misÀJourLe: modifiéeLe,
    },
  );
};
