import { match } from 'ts-pattern';

import { UtilisateurEntity, UtilisateurInvitéEventV1 } from '@potentiel-domain/utilisateur';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { mapToUtilisateurPayload } from './utilisateurInvité.projector';

export const utilisateurInvitéV1Projector = async ({ payload }: UtilisateurInvitéEventV1) => {
  const utilisateurToUpsert = match(payload)
    .with({ rôle: 'acheteur-obligé' }, () =>
      mapToUtilisateurPayload({
        ...payload,
        rôle: 'cocontractant',
        zone: 'métropole',
      }),
    )
    .otherwise(mapToUtilisateurPayload);

  await upsertProjection<UtilisateurEntity>(`utilisateur|${payload.identifiantUtilisateur}`, {
    ...utilisateurToUpsert,
    identifiantUtilisateur: payload.identifiantUtilisateur,
    invitéLe: payload.invitéLe,
    invitéPar: payload.invitéPar,
  });
};
