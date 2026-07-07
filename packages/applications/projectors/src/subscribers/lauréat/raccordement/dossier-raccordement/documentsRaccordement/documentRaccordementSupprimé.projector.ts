import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const documentRaccordementSuppriméV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, suppriméLe, type },
}: Lauréat.Raccordement.DocumentRaccordementSuppriméEventV1) => {
  const dossier = await findProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
  );

  if (Option.isNone(dossier)) {
    throw new Error("Le dossier de raccordement du document n'existe pas");
  }

  await upsertProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      ...dossier,
      [Lauréat.Raccordement.TypeDocumentsRaccordement.mapDocumentTypeToEntityKey(type)]: undefined,
      miseÀJourLe: DateTime.convertirEnValueType(suppriméLe).formatter(),
    },
  );
};
