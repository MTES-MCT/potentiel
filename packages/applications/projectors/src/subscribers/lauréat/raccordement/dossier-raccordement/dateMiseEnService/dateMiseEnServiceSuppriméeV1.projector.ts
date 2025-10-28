import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { getDossierRaccordement } from '../../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const dateMiseEnServiceSuppriméeV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement },
  created_at,
}: Lauréat.Raccordement.DateMiseEnServiceSuppriméeEvent & Event) => {
  const { dossier, raccordement } = await getDossierRaccordement(
    identifiantProjet,
    référenceDossierRaccordement,
  );
  const miseÀJourLe = DateTime.convertirEnValueType(created_at).formatter();

  await upsertDossierRaccordement({
    identifiantProjet,
    raccordement,
    dossierRaccordement: {
      ...dossier,
      miseEnService: undefined,
      miseÀJourLe,
    },
  });
};
