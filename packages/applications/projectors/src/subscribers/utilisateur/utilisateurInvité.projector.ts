import { match } from 'ts-pattern';

import { UtilisateurEntity, UtilisateurInvitéEvent } from '@potentiel-domain/utilisateur';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const utilisateurInvitéProjector = async ({ payload }: UtilisateurInvitéEvent) => {
  const { identifiantUtilisateur, invitéLe, invitéPar } = payload;

  const porteurToUpsert = match(payload)
    .with({ rôle: 'dgec-validateur' }, ({ rôle, fonction, nomComplet }) => ({
      rôle,
      fonction,
      nomComplet,
    }))
    .with({ rôle: 'dreal' }, ({ rôle, région }) => ({
      rôle,
      région,
    }))
    .with({ rôle: 'grd' }, ({ rôle, identifiantGestionnaireRéseau }) => ({
      rôle,
      identifiantGestionnaireRéseau,
    }))
    .otherwise(({ rôle }) => ({ rôle }));

  await upsertProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`, {
    ...porteurToUpsert,
    identifiantUtilisateur,
    invitéLe,
    invitéPar,
  });
};
