import { Raccordement } from '@potentiel-domain/laureat';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';

import { getDossierRaccordement } from '../../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const accuséRéceptionDemandeComplèteRaccordementTransmisV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, format },
  created_at,
}: Raccordement.AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1 & Event) => {
  const { raccordement, dossier } = await getDossierRaccordement(
    identifiantProjet,
    référenceDossierRaccordement,
  );

  await upsertDossierRaccordement({
    identifiantProjet,
    raccordement,
    dossierRaccordement: {
      ...dossier,
      demandeComplèteRaccordement: {
        ...dossier.demandeComplèteRaccordement,
        accuséRéception: {
          format,
        },
      },
      misÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });
};
