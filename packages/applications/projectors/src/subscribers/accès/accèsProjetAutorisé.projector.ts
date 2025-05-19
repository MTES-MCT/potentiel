import { Accès } from '@potentiel-domain/projet';
import { UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const accèsProjetAutoriséProjector = async ({
  payload: { identifiantProjet, identifiantUtilisateur },
}: Accès.AccèsProjetAutoriséEvent) => {
  const accèsProjetActuel = await findProjection<Accès.AccèsEntity>(`accès|${identifiantProjet}`);

  await upsertProjection(`accès|${identifiantProjet}`, {
    identifiantProjet,
    utilisateursAyantAccès: Option.match(accèsProjetActuel)
      .some(({ utilisateursAyantAccès }) => utilisateursAyantAccès.concat(identifiantUtilisateur))
      .none(() => [identifiantUtilisateur]),
  });

  const porteur = await findProjection<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`);

  if (Option.isNone(porteur) || porteur.rôle !== 'porteur-projet') {
    return;
  }

  const projets = porteur.projets.concat(identifiantProjet);

  const newUtilisateur = {
    ...porteur,
    projets,
  };

  await upsertProjection<UtilisateurEntity>(
    `utilisateur|${identifiantUtilisateur}`,
    newUtilisateur,
  );
};
