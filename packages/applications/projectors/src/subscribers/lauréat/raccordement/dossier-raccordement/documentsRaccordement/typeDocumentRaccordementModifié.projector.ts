import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const typeDocumentRaccordementModifiéV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, modifiéLe, ancienType, nouveauType },
}: Lauréat.Raccordement.TypeDocumentRaccordementModifiéEventV1) => {
  const dossier = await findProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
  );

  if (Option.isNone(dossier)) {
    throw new Error("Le dossier de raccordement du document n'existe pas");
  }

  const document =
    dossier[Lauréat.Raccordement.TypeDocumentsRaccordement.mapToFieldName(ancienType)];

  await upsertProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      ...dossier,
      [Lauréat.Raccordement.TypeDocumentsRaccordement.mapToFieldName(nouveauType)]: document,
      [Lauréat.Raccordement.TypeDocumentsRaccordement.mapToFieldName(ancienType)]: undefined,
      miseÀJourLe: DateTime.convertirEnValueType(modifiéLe).formatter(),
    },
  );
};
