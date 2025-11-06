import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { UtilisateurEntity } from '@potentiel-domain/utilisateur';

import { rebuildProjection } from '../../helpers';

export const utilisateurRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await rebuildProjection<UtilisateurEntity>('utilisateur', id);
};
