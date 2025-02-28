import { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { UtilisateurEntity } from '@potentiel-domain/utilisateur';

import { removeProjection } from '../../infrastructure';

export const utilisateurRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<UtilisateurEntity>(`utilisateur|${id}`);
};
