import { Accès } from '@potentiel-domain/projet';
import { UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const accèsProjetRetiréProjector = async ({
  payload: { identifiantProjet, identifiantsUtilisateur },
}: Accès.AccèsProjetRetiréEvent) => {
  const accèsProjetActuel = await findProjection<Accès.AccèsEntity>(`accès|${identifiantProjet}`);

  if (Option.isSome(accèsProjetActuel))
    await upsertProjection(`accès|${identifiantProjet}`, {
      ...accèsProjetActuel,
      utilisateursAyantAccès: accèsProjetActuel.utilisateursAyantAccès.filter(
        (u) => !identifiantsUtilisateur.includes(u),
      ),
    });

  for (const identifiantUtilisateur of identifiantsUtilisateur) {
    const porteur = await findProjection<UtilisateurEntity>(
      `utilisateur|${identifiantUtilisateur}`,
    );

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
  }
};
