import { match } from 'ts-pattern';

import { UtilisateurEntity, UtilisateurInvitéEvent } from '@potentiel-domain/utilisateur';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const utilisateurInvitéProjector = async ({ payload }: UtilisateurInvitéEvent) => {
  const { identifiantUtilisateur, invitéLe, invitéPar } = payload;

  await upsertProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`, {
    ...mapToUtilisateurPayload(payload),
    identifiantUtilisateur,
    invitéLe,
    invitéPar,
  });
};

export const mapToUtilisateurPayload = (payload: UtilisateurInvitéEvent['payload']) => {
  return match(payload)
    .with({ rôle: 'dgec-validateur' }, ({ rôle, fonction, nomComplet }) => ({
      rôle,
      fonction,
      nomComplet,
    }))
    .with({ rôle: 'dreal' }, ({ rôle, région }) => ({
      rôle,
      région,
    }))
    .with({ rôle: 'cocontractant' }, ({ rôle, zone }) => ({
      rôle,
      zone,
    }))
    .with({ rôle: 'grd' }, ({ rôle, identifiantGestionnaireRéseau }) => ({
      rôle,
      identifiantGestionnaireRéseau,
    }))
    .otherwise(({ rôle }) => ({ rôle }));
};
