import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeComplèteRaccordementModifiéeV3Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, dateQualification, accuséRéception },
  created_at,
}: Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV3 & Event) => {
  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      demandeComplèteRaccordement: {
        dateQualification,
        ...(accuséRéception && {
          accuséRéception,
        }),
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  );
};
