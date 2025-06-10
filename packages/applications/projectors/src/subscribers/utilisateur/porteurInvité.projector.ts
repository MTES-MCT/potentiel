import { PorteurInvitéEvent, UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const porteurInvitéProjector = async ({
  payload: { identifiantUtilisateur, invitéLe, invitéPar },
}: PorteurInvitéEvent) => {
  const porteur = await findProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`);

  const newUtilisateur = {
    rôle: 'porteur-projet' as const,
    identifiantUtilisateur,
    invitéPar: Option.match(porteur)
      .some((porteur) => porteur.invitéPar)
      .none(() => invitéPar),
    invitéLe: Option.match(porteur)
      .some((porteur) => porteur.invitéLe)
      .none(() => invitéLe),
  };

  await upsertProjection<UtilisateurEntity>(
    `utilisateur|${identifiantUtilisateur}`,
    newUtilisateur,
  );
};
