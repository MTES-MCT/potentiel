import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { getDossierRaccordement } from '../../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const dateMiseEnServiceTransmiseV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, dateMiseEnService },
  created_at,
}: Lauréat.Raccordement.DateMiseEnServiceTransmiseV1Event & Event) => {
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
      miseEnService: {
        dateMiseEnService,
        transmiseLe: miseÀJourLe,
      },
      miseÀJourLe,
    },
  });
};
