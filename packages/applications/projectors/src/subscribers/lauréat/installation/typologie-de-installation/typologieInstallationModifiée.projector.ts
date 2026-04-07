import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const typologieInstallationModifiéeProjector = async ({
  payload: { identifiantProjet, typologieInstallation, modifiéeLe },
}: Lauréat.Installation.TypologieInstallationModifiéeEvent) => {
  const installationActuelle = await findProjection<Lauréat.Installation.InstallationEntity>(
    `installation|${identifiantProjet}`,
  );

  const payload = {
    identifiantProjet,
    typologieInstallation,
    miseÀJourLe: modifiéeLe,
  };

  if (Option.isNone(installationActuelle)) {
    // Pour ce champs "supplémentaire", la modification peut être une initialisation de la valeur
    await upsertProjection<Lauréat.Installation.InstallationEntity>(
      `installation|${identifiantProjet}`,
      payload,
    );
  } else {
    await updateOneProjection<Lauréat.Installation.InstallationEntity>(
      `installation|${identifiantProjet}`,
      payload,
    );
  }
};
