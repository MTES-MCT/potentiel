import { PorteurInvitéEvent, UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const porteurInvitéProjector = async ({
  payload: { identifiantProjet, identifiantUtilisateur, invitéLe, invitéPar },
}: PorteurInvitéEvent) => {
  const porteur = await findProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`);

  const projets = Option.match(porteur)
    .some((p) => (p.rôle === 'porteur-projet' ? p.projets : []))
    .none(() => []);

  const newUtilisateur = {
    rôle: 'porteur-projet' as const,
    identifiantUtilisateur,
    projets: [...projets, identifiantProjet],
    invitéLe,
    invitéPar,
  };

  await upsertProjection<UtilisateurEntity>(
    `utilisateur|${identifiantUtilisateur}`,
    newUtilisateur,
  );
};
