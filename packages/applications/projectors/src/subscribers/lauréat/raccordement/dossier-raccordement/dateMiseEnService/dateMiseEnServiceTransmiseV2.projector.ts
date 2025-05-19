import { Raccordement } from '@potentiel-domain/laureat';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime, Email } from '@potentiel-domain/common';

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
}: Raccordement.DateMiseEnServiceTransmiseEvent & Event) => {
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
      miseEnService: {
        dateMiseEnService,
        transmiseLe,
        tranmisePar: Email.convertirEnValueType(transmisePar).formatter(),
      },
      misÀJourLe,
    },
  });
};
