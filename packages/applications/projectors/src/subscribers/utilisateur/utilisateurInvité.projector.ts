import { match } from 'ts-pattern';

import { UtilisateurEntity, UtilisateurInvitéEvent } from '@potentiel-domain/utilisateur';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const utilisateurInvitéProjector = async ({ payload }: UtilisateurInvitéEvent) => {
  const { identifiantUtilisateur } = payload;

  const porteurToUpsert = match(payload)
    .with(
      { rôle: 'dgec-validateur' },
      ({ identifiantUtilisateur, rôle, fonction, nomComplet }) => ({
        identifiantUtilisateur,
        rôle,
        fonction,
        nomComplet,
      }),
    )
    .with({ rôle: 'dreal' }, ({ identifiantUtilisateur, rôle, région }) => ({
      identifiantUtilisateur,
      rôle,
      région,
    }))
    .with({ rôle: 'grd' }, ({ identifiantUtilisateur, rôle, identifiantGestionnaireRéseau }) => ({
      identifiantUtilisateur,
      rôle,
      identifiantGestionnaireRéseau,
    }))
    .otherwise(({ identifiantUtilisateur, rôle }) => ({ identifiantUtilisateur, rôle }));

  await upsertProjection<UtilisateurEntity>(
    `utilisateur|${identifiantUtilisateur}`,
    porteurToUpsert,
  );
};
