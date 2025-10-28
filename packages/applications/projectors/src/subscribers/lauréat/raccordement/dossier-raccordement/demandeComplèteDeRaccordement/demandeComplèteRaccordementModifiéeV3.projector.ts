import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { getDossierRaccordement } from '../../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const demandeComplèteRaccordementModifiéeV3Projector = async ({
  payload: {
    identifiantProjet,
    référenceDossierRaccordement,
    dateQualification,
    accuséRéception: { format },
  },
  created_at,
}: Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEvent & Event) => {
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
        accuséRéception: {
          format,
        },
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });
};
