import { match } from 'ts-pattern';

import {
  UtilisateurEntity,
  Utilisateur,
  UtilisateurInvitéEvent,
} from '@potentiel-domain/utilisateur';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const utilisateurInvitéProjector = async ({ payload }: UtilisateurInvitéEvent) => {
  const { identifiantUtilisateur, invitéLe, invitéPar } = payload;

  const utilisateur = mapToUtilisateurPayload(payload);

  if (utilisateur.rôle === 'visiteur') {
    throw new Error("Le rôle 'visiteur' ne peut pas être invité");
  }
  await upsertProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`, {
    ...utilisateur,
    identifiantUtilisateur,
    invitéLe,
    invitéPar,
    rôle: utilisateur.rôle,
  });
};

export const mapToUtilisateurPayload = (payload: Utilisateur.SpécificitésRolePayload) => {
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
