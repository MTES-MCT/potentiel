import { UtilisateurEntity, RôleUtilisateurModifiéEvent } from '@potentiel-domain/utilisateur';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

import { mapToUtilisateurPayload } from './utilisateurInvité.projector';

export const rôleUtilisateurModifiéProjector = async ({ payload }: RôleUtilisateurModifiéEvent) => {
  const { identifiantUtilisateur } = payload;

  const utilisateurToUpsert = mapToUtilisateurPayload(payload);

  const existingUtilisateur = await findProjection<UtilisateurEntity>(
    `utilisateur|${identifiantUtilisateur}`,
  );

  if (Option.isNone(existingUtilisateur)) {
    throw new Error('Utilisateur non trouvé');
  }

  // on n'utilise pas updateOneProjection car on veut remplacer tous les champs non liés au rôle de l'utilisateur
  await upsertProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`, {
    identifiantUtilisateur: existingUtilisateur.identifiantUtilisateur,
    invitéLe: existingUtilisateur.invitéLe,
    invitéPar: existingUtilisateur.invitéPar,
    ...utilisateurToUpsert,
  });
};
