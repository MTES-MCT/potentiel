import { PorteurInvitéEvent, UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';

import { upsertProjection } from '../../infrastructure';

export const PorteurInvitéProjector = async ({
  payload: { identifiantsProjet, identifiantUtilisateur, autoriséLe, autoriséPar },
}: PorteurInvitéEvent) => {
  const porteur = await findProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`);

  const projets = Option.match(porteur)
    .some((p) => (p.rôle === 'porteur-projet' ? p.projets : []))
    .none(() => []);

  const newUtilisateur = {
    rôle: 'porteur-projet' as const,
    identifiantUtilisateur,
    projets: [...projets, ...identifiantsProjet],
    invitéPar: Option.match(porteur)
      .some((porteur) => porteur.invitéPar)
      .none(() => autoriséPar),
    invitéLe: Option.match(porteur)
      .some((porteur) => porteur.invitéLe)
      .none(() => autoriséLe),
  };

  await upsertProjection<UtilisateurEntity>(
    `utilisateur|${identifiantUtilisateur}`,
    newUtilisateur,
  );
};
