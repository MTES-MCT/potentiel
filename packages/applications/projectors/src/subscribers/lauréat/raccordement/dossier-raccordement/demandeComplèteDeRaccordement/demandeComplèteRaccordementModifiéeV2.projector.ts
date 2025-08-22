import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';
import type { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getDossierRaccordement } from '../../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const demandeComplèteRaccordementModifiéeV2Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, dateQualification },
  created_at,
}: Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV2 & Event) => {
  const { dossier, raccordement } = await getDossierRaccordement(
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
        dateQualification,
      },
      misÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });
};
