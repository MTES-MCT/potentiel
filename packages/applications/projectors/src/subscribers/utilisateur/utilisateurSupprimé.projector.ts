import { UtilisateurEntity, UtilisateurSuppriméEvent } from '@potentiel-domain/utilisateur';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

export const utilisateurSuppriméProjector = async ({
  payload: { identifiantUtilisateur },
}: UtilisateurSuppriméEvent) => {
  await removeProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`);
};
