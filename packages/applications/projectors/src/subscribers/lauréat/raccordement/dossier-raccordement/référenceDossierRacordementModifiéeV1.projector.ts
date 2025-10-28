import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';
import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { getDossierRaccordement } from '../_utils/getDossierRaccordement';
import { upsertDossierRaccordement } from '../_utils/upsertDossierRaccordement';

export const référenceDossierRacordementModifiéeV1Projector = async ({
  payload: {
    identifiantProjet,
    nouvelleRéférenceDossierRaccordement,
    référenceDossierRaccordementActuelle,
  },
  created_at,
}: Lauréat.Raccordement.RéférenceDossierRacordementModifiéeEventV1 & Pick<Event, 'created_at'>) => {
  const { dossier, raccordement } = await getDossierRaccordement(
    identifiantProjet,
    référenceDossierRaccordementActuelle,
  );

  await removeProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordementActuelle}`,
  );

  await upsertDossierRaccordement({
    identifiantProjet,
    raccordement: {
      ...raccordement,
      dossiers: raccordement.dossiers.filter(
        (d) => d.référence !== référenceDossierRaccordementActuelle,
      ),
    },
    dossierRaccordement: {
      ...dossier,
      référence: nouvelleRéférenceDossierRaccordement,
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });
};
