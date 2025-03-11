import { ProjetRéclaméEvent, UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';

import { upsertProjection } from '../../infrastructure';

export const projetRéclaméProjector = async ({
  payload: { identifiantUtilisateur, identifiantProjet, réclaméLe },
}: ProjetRéclaméEvent) => {
  const porteur = await findProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`);

  const projets = Option.match(porteur)
    .some((p) => (p.rôle === 'porteur-projet' ? p.projets : []))
    .none(() => []);

  const newUtilisateur = {
    rôle: 'porteur-projet' as const,
    identifiantUtilisateur,
    projets: [...projets, identifiantProjet],
    invitéPar: Option.match(porteur)
      .some((porteur) => porteur.invitéPar)
      .none(() => identifiantUtilisateur),
    invitéLe: Option.match(porteur)
      .some((porteur) => porteur.invitéLe)
      .none(() => réclaméLe),
  };

  await upsertProjection<UtilisateurEntity>(
    `utilisateur|${identifiantUtilisateur}`,
    newUtilisateur,
  );
};
