import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';

import { référenceDossierRacordementModifiéeV1Projector } from './référenceDossierRacordementModifiéeV1.projector.js';

export const référenceDossierRacordementModifiéeV2Projector = async ({
  payload: {
    identifiantProjet,
    nouvelleRéférenceDossierRaccordement,
    référenceDossierRaccordementActuelle,
  },
  created_at,
}: Lauréat.Raccordement.RéférenceDossierRacordementModifiéeEvent & Event) => {
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
