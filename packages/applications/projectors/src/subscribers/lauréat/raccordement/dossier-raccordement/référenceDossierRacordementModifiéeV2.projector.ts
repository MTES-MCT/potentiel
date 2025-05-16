import { Raccordement } from '@potentiel-domain/laureat';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { référenceDossierRacordementModifiéeV1Projector } from './référenceDossierRacordementModifiéeV1.projector';

export const référenceDossierRacordementModifiéeV2Projector = async ({
  payload: {
    identifiantProjet,
    nouvelleRéférenceDossierRaccordement,
    référenceDossierRaccordementActuelle,
  },
  created_at,
}: Raccordement.RéférenceDossierRacordementModifiéeEvent & Event) => {
  await référenceDossierRacordementModifiéeV1Projector({
    type: 'RéférenceDossierRacordementModifiée-V1',
    payload: {
      identifiantProjet,
      nouvelleRéférenceDossierRaccordement,
      référenceDossierRaccordementActuelle,
    },
    created_at,
  });
};
