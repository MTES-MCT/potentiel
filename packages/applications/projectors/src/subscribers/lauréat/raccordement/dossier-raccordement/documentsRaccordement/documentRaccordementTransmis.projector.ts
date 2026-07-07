import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

import { mapDocumentTypeToEntityKey } from './helpers/mapDocumentTypeToEntityKey.js';

export const documentRaccordementTransmisV1Projector = async ({
  payload: {
    identifiantProjet,
    référenceDossierRaccordement,
    dateSignature,
    document,
    transmisLe,
    type,
  },
}: Lauréat.Raccordement.DocumentRaccordementTransmisEventV1) => {
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
      miseÀJourLe: DateTime.convertirEnValueType(transmisLe).formatter(),
    },
  );
};
