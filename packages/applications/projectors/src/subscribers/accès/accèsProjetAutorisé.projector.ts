import { Accès } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const accèsProjetAutoriséProjector = async ({
  payload: { identifiantProjet, identifiantUtilisateur },
}: Accès.AccèsProjetAutoriséEvent) => {
  const accèsProjetActuel = await findProjection<Accès.AccèsEntity>(`accès|${identifiantProjet}`);

  await upsertProjection<Accès.AccèsEntity>(`accès|${identifiantProjet}`, {
    identifiantProjet,
    utilisateursAyantAccès: Option.match(accèsProjetActuel)
      .some(({ utilisateursAyantAccès }) => utilisateursAyantAccès.concat(identifiantUtilisateur))
      .none(() => [identifiantUtilisateur]),
  });
};
