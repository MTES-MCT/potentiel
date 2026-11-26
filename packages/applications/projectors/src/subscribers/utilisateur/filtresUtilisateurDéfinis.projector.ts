import type {
  FiltresUtilisateurDéfinisEvent,
  UtilisateurEntity,
} from '@potentiel-domain/utilisateur';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const filtresUtilisateurDéfinisProjector = async ({
  payload,
}: FiltresUtilisateurDéfinisEvent) => {
  const { identifiantUtilisateur, filtres } = payload;

  const existingUtilisateur = await findProjection<UtilisateurEntity>(
    `utilisateur|${identifiantUtilisateur}`,
  );

  if (Option.isNone(existingUtilisateur)) {
    throw new Error('Utilisateur non trouvé');
  }

  await updateOneProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`, {
    identifiantUtilisateur: existingUtilisateur.identifiantUtilisateur,
    filtres,
  });
};
