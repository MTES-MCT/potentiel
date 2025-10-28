import { UtilisateurInvitéEventV1 } from '@potentiel-domain/utilisateur';

import { utilisateurInvitéProjector } from './utilisateurInvité.projector';

export const utilisateurInvitéV1Projector = async ({ payload }: UtilisateurInvitéEventV1) => {
  // Gérer le cas particulier de l'ancien rôle "acheteur-obligé"
  if (payload.rôle === 'acheteur-obligé') {
    await utilisateurInvitéProjector({
      type: 'UtilisateurInvité-V2',
      payload: {
        ...payload,
        rôle: 'cocontractant',
        zone: 'métropole',
      },
    });
  } else {
    await utilisateurInvitéProjector({
      type: 'UtilisateurInvité-V2',
      payload,
    });
  }
};
