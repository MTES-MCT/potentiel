import { match } from 'ts-pattern';

import {
  SpécificitésRoleEventPayload,
  UtilisateurEntity,
  UtilisateurInvitéEvent,
} from '@potentiel-domain/utilisateur';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const utilisateurInvitéProjector = async ({ type, payload }: UtilisateurInvitéEvent) => {
  const { identifiantUtilisateur, invitéLe, invitéPar } = payload;

  // Gérer le cas particulier de l'ancien rôle "acheteur-obligé"
  if ((payload.rôle as string) === 'acheteur-obligé') {
    await utilisateurInvitéProjector({
      type,
      payload: {
        ...payload,
        rôle: 'cocontractant',
        zone: 'métropole',
      },
    });
    return;
  }

  await upsertProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`, {
    ...mapToRôleUtilisateurPayload(payload),
    identifiantUtilisateur,
    invitéLe,
    invitéPar,
  });
};

export const mapToRôleUtilisateurPayload = (payload: SpécificitésRoleEventPayload) => {
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
