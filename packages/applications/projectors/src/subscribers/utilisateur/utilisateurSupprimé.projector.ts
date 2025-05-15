import { UtilisateurEntity, UtilisateurSuppriméEvent } from '@potentiel-domain/utilisateur';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const utilisateurSuppriméProjector = async ({
  payload: { identifiantUtilisateur },
}: UtilisateurSuppriméEvent) => {
  await updateOneProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`, {
    supprimé: true,
  });
};
