import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { rebuildProjection } from '../../../helpers';

export const installationrebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await rebuildProjection<Lauréat.Installation.InstallationEntity>(`installation`, id);
};
