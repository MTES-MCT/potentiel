import type { UtilisateurEntity } from '@potentiel-domain/utilisateur';
import type { RebuildTriggered } from '@potentiel-infrastructure/pg-event-sourcing';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const utilisateurRebuildTriggered = async ({ payload: { id } }: RebuildTriggered) => {
  await removeProjection<UtilisateurEntity>(`utilisateur|${id}`);
};
