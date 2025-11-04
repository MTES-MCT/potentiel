import { UtilisateurEntity, RôleUtilisateurModifiéEvent } from '@potentiel-domain/utilisateur';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

import { mapToUtilisateurPayload } from './utilisateurInvité.projector';

export const rôleUtilisateurModifiéProjector = async ({ payload }: RôleUtilisateurModifiéEvent) => {
  const { identifiantUtilisateur } = payload;

  const porteurToUpsert = mapToUtilisateurPayload(payload);

  const existingUtilisateur = await findProjection<UtilisateurEntity>(
    `utilisateur|${identifiantUtilisateur}`,
  );

  if (Option.isNone(existingUtilisateur)) {
    throw new Error('Utilisateur non trouvé');
  }

  await upsertProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`, {
    ...existingUtilisateur,
    ...porteurToUpsert,
  });
};
