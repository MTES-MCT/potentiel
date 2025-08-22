import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getDossierRaccordement } from '../../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const accuséRéceptionDemandeComplèteRaccordementTransmisV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, format },
  created_at,
}: Lauréat.Raccordement.AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1 & Event) => {
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
