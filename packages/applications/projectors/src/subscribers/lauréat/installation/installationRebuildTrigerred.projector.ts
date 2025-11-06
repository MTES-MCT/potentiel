import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { clearProjection } from '../../../helpers';

export const installationrebuildTriggeredProjector = async ({
  payload: { id },
}: RebuildTriggered) => {
  await clearProjection<Lauréat.Installation.InstallationEntity>(`installation`, id);
};
