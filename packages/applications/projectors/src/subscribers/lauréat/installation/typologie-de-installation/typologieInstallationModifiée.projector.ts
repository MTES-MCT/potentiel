import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const typologieInstallationModifiéeProjector = async ({
  payload: { identifiantProjet, typologieInstallation, modifiéeLe },
}: Lauréat.Installation.TypologieInstallationModifiéeEvent) => {
  const installationActuelle = await findProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
  );

  await upsertProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
    {
      // Pour ce champ supplémentaire, la modification peut être une initialisation de la valeur
      ...(Option.isSome(installationActuelle) ? installationActuelle : {}),
      identifiantProjet,
      typologieInstallation,
      miseÀJourLe: modifiéeLe,
    },
  );
};
