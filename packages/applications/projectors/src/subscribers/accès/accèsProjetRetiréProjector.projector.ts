import { Accès } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const accèsProjetRetiréProjector = async ({
  payload: { identifiantProjet, identifiantUtilisateurs },
}: Accès.AccèsProjetRetiréEvent) => {
  const accèsProjetActuel = await findProjection<Accès.AccèsEntity>(`accès|${identifiantProjet}`);

  if (Option.isSome(accèsProjetActuel))
    await upsertProjection(`accès|${identifiantProjet}`, {
      ...accèsProjetActuel,
      utilisateursAyantAccès: accèsProjetActuel.utilisateursAyantAccès.filter(
        (u) => !identifiantUtilisateurs.includes(u),
      ),
    });
};
