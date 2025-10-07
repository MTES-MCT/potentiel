import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Lauréat } from '@potentiel-domain/projet';

export const installationRebuilTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await removeProjection<Lauréat.Installation.InstallationEntity>(`installation|${id}`);
  await removeProjection<Lauréat.Installation.InstallateurEntity>(`installateur|${id}`);
};
