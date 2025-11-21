import { Accès } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const accèsProjetRemplacéProjector = async ({
  payload: { identifiantProjet, identifiantUtilisateur, nouvelIdentifiantUtilisateur },
}: Accès.AccèsProjetRemplacéEvent) => {
  const accèsProjetActuel = await findProjection<Accès.AccèsEntity>(`accès|${identifiantProjet}`);

  await upsertProjection<Accès.AccèsEntity>(`accès|${identifiantProjet}`, {
    identifiantProjet,
    utilisateursAyantAccès: Option.match(accèsProjetActuel)
      .some(({ utilisateursAyantAccès }) =>
        utilisateursAyantAccès
          .filter((identifiant) => identifiant !== identifiantUtilisateur)
          .concat(nouvelIdentifiantUtilisateur),
      )
      .none(() => [nouvelIdentifiantUtilisateur]),
  });
};
