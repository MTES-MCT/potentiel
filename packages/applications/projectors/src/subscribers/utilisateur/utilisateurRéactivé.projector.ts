import { UtilisateurEntity, UtilisateurRéactivéEvent } from '@potentiel-domain/utilisateur';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

export const utilisateurRéactivéProjector = async ({
  payload: { identifiantUtilisateur },
}: UtilisateurRéactivéEvent) => {
  const key = `utilisateur|${identifiantUtilisateur}` as const;
  const utilisateur = await findProjection<UtilisateurEntity>(key);
  if (Option.isNone(utilisateur)) {
    getLogger().error(`Utilisateur non trouvé`, {
      identifiantUtilisateur,
      fonction: 'utilisateurRéactivéProjector',
    });
    return;
  }
  await upsertProjection<UtilisateurEntity>(key, {
    ...utilisateur,
    désactivé: undefined,
  });
};
