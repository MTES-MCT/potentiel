import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { UtilisateurEntity } from '@potentiel-domain/utilisateur';

import { clearProjection } from '../../helpers';

export const utilisateurRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await clearProjection<UtilisateurEntity>('utilisateur', id);
};
