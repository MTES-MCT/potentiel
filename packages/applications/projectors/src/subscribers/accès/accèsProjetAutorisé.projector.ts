import type { Accès } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { createProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const accèsProjetAutoriséProjector = async ({
  payload: { identifiantProjet, identifiantUtilisateur },
}: Accès.AccèsProjetAutoriséEvent) => {
  const accèsProjetActuel = await findProjection<Accès.AccèsEntity>(`accès|${identifiantProjet}`);

  if (Option.isNone(accèsProjetActuel)) {
    await createProjection<Accès.AccèsEntity>(`accès|${identifiantProjet}`, {
      identifiantProjet,
      utilisateursAyantAccès: [identifiantUtilisateur],
    });
    return;
  }

  const utilisateursAyantAccès = new Set(accèsProjetActuel.utilisateursAyantAccès);

  utilisateursAyantAccès.add(identifiantUtilisateur);

  await upsertProjection<Accès.AccèsEntity>(`accès|${identifiantProjet}`, {
    identifiantProjet,
    utilisateursAyantAccès: Array.from(utilisateursAyantAccès),
  });
};
