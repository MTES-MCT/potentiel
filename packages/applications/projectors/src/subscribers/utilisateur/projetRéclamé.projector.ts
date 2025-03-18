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

  // Si c'est son premier projet, la réclamation est considérée
  // comme la première invitation du porteur sur Potentiel
  const { invitéLe, invitéPar } = Option.isSome(porteur)
    ? porteur
    : { invitéPar: identifiantUtilisateur, invitéLe: réclaméLe };

  const newUtilisateur = {
    rôle: 'porteur-projet' as const,
    identifiantUtilisateur,
    projets: [...projets, identifiantProjet],
    invitéPar,
    invitéLe,
  };

  await upsertProjection<UtilisateurEntity>(
    `utilisateur|${identifiantUtilisateur}`,
    newUtilisateur,
  );
};
