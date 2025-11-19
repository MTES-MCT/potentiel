import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const accuséRéceptionDemandeComplèteRaccordementTransmisV1Projector = async ({
  payload: { identifiantProjet, référenceDossierRaccordement, format },
  created_at,
}: Lauréat.Raccordement.AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1 & Event) => {
  await updateOneProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      demandeComplèteRaccordement: { accuséRéception: { format } },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  );
};
