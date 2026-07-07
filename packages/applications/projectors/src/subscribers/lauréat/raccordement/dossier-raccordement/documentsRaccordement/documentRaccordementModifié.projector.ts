import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

import { mapDocumentTypeToEntityKey } from './helpers/mapDocumentTypeToEntityKey.js';

export const documentRaccordementModifiéV1Projector = async ({
  payload: {
    identifiantProjet,
    référenceDossierRaccordement,
    dateSignature,
    document,
    modifiéLe,
    type,
  },
}: Lauréat.Raccordement.DocumentRaccordementModifiéEventV1) => {
  const payload = {
    [mapDocumentTypeToEntityKey(type)]: {
      dateSignature,
      document,
    },
  };

  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      ...payload,
      miseÀJourLe: DateTime.convertirEnValueType(modifiéLe).formatter(),
    },
  );
};
