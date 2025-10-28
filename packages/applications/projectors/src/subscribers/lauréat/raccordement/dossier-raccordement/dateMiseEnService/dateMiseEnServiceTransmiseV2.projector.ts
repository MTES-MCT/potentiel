import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime, Email } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { getDossierRaccordement } from '../../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../../_utils/upsertDossierRaccordement';

export const dateMiseEnServiceTransmiseV2Projector = async ({
  payload: {
    identifiantProjet,
    référenceDossierRaccordement,
    dateMiseEnService,
    transmiseLe,
    transmisePar,
  },
  created_at,
}: Lauréat.Raccordement.DateMiseEnServiceTransmiseEvent & Event) => {
  const { dossier, raccordement } = await getDossierRaccordement(
    identifiantProjet,
    référenceDossierRaccordement,
  );

  await upsertDossierRaccordement({
    identifiantProjet,
    raccordement,
    dossierRaccordement: {
      ...dossier,
      miseEnService: {
        dateMiseEnService,
        transmiseLe,
        transmisePar: Email.convertirEnValueType(transmisePar).formatter(),
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });
};
