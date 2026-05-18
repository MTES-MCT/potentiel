import type { UtilisateurEntity } from '@potentiel-domain/utilisateur';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';

import { clearProjection } from '../../helpers/index.js';

export const utilisateurRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await clearProjection<UtilisateurEntity>('utilisateur', id);
};
