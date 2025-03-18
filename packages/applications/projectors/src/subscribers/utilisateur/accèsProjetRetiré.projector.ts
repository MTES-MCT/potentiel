import { AccèsProjetRetiréEvent, UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const accèsProjetRetiréProjector = async ({
  payload: { identifiantProjet, identifiantUtilisateur },
}: AccèsProjetRetiréEvent) => {
  const porteur = await findProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`);

  if (Option.isNone(porteur) || porteur.rôle !== 'porteur-projet') {
    return;
  }

  const projets = porteur.projets.filter((p) => p !== identifiantProjet);

  const newUtilisateur = {
    ...porteur,
    projets,
  };

  await upsertProjection<UtilisateurEntity>(
    `utilisateur|${identifiantUtilisateur}`,
    newUtilisateur,
  );
};
