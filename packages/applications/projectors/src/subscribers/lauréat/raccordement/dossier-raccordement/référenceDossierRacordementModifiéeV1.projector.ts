import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const référenceDossierRacordementModifiéeV1Projector = async ({
  payload: {
    identifiantProjet,
    nouvelleRéférenceDossierRaccordement,
    référenceDossierRaccordementActuelle,
  },
  created_at,
}: Lauréat.Raccordement.RéférenceDossierRacordementModifiéeEventV1 & Pick<Event, 'created_at'>) => {
  const dossier = await findProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordementActuelle}`,
  );

  if (Option.isNone(dossier)) {
    throw new Error('Dossier non trouvé');
  }

  await upsertProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${nouvelleRéférenceDossierRaccordement}`,
    {
      ...dossier,
      référence: nouvelleRéférenceDossierRaccordement,
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  );
  await removeProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordementActuelle}`,
  );
};
