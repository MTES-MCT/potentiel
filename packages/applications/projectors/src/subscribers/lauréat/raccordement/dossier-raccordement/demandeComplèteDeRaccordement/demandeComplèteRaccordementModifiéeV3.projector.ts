import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeComplèteRaccordementModifiéeV3Projector = async ({
  payload: {
    identifiantProjet,
    référenceDossierRaccordement,
    dateQualification,
    accuséRéception: { format },
  },
  created_at,
}: Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEvent & Event) => {
  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      demandeComplèteRaccordement: {
        dateQualification,
        accuséRéception: {
          format,
        },
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  );
};
