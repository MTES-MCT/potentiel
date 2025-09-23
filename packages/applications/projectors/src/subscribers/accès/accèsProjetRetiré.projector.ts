import { Accès } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const accèsProjetRetiréProjector = async ({
  payload: { identifiantProjet, identifiantsUtilisateur },
}: Accès.AccèsProjetRetiréEvent) => {
  const accèsProjetActuel = await findProjection<Accès.AccèsEntity>(`accès|${identifiantProjet}`);

  if (Option.isSome(accèsProjetActuel)) {
    const nouveauxUtilisateurs = accèsProjetActuel.utilisateursAyantAccès.filter(
      (u) => !identifiantsUtilisateur.includes(u),
    );

    if (nouveauxUtilisateurs.length > 0) {
      await upsertProjection(`accès|${identifiantProjet}`, {
        ...accèsProjetActuel,
        utilisateursAyantAccès: nouveauxUtilisateurs,
      });
    } else {
      await removeProjection(`accès|${identifiantProjet}`);
    }
  }
};
