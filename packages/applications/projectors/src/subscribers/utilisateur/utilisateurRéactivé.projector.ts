import { UtilisateurEntity, UtilisateurRéactivéEvent } from '@potentiel-domain/utilisateur';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const utilisateurRéactivéProjector = async ({
  payload: { identifiantUtilisateur },
}: UtilisateurRéactivéEvent) => {
  await updateOneProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`, {
    désactivé: undefined,
  });
};
