import { Raccordement } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getDossierRaccordement } from '../../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const dateMiseEnServiceSuppriméeV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement },
  created_at,
}: Raccordement.DateMiseEnServiceSuppriméeEvent & Event) => {
  const { dossier, raccordement } = await getDossierRaccordement(
    identifiantProjet,
    référenceDossierRaccordement,
  );
  const misÀJourLe = DateTime.convertirEnValueType(created_at).formatter();

  await upsertDossierRaccordement({
    identifiantProjet,
    raccordement,
    dossierRaccordement: {
      ...dossier,
      miseEnService: undefined,
      misÀJourLe,
    },
  });
};
