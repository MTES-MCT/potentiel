import { Raccordement } from '@potentiel-domain/projet';
import { Raccordement as RaccordementLauréat } from '@potentiel-domain/laureat';
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
}: RaccordementLauréat.RéférenceDossierRacordementModifiéeEventV1 & Pick<Event, 'created_at'>) => {
  const { dossier, raccordement } = await getDossierRaccordement(
    identifiantProjet,
    référenceDossierRaccordementActuelle,
  );

  await removeProjection<Raccordement.DossierRaccordementEntity>(
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
      misÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  });
};
