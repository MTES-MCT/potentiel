import { UtilisateurEntity, UtilisateurDésactivéEvent } from '@potentiel-domain/utilisateur';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const utilisateurDésactivéProjector = async ({
  payload: { identifiantUtilisateur },
}: UtilisateurDésactivéEvent) => {
  await updateOneProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`, {
    désactivé: true,
  });
};
