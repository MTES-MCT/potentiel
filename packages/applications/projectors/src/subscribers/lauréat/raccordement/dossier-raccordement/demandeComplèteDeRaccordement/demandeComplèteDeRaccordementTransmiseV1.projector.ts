import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

export const demandeComplèteDeRaccordementTransmiseV1Projector = async ({
  payload: {
    identifiantProjet,
    identifiantGestionnaireRéseau,
    référenceDossierRaccordement,
    dateQualification,
  },
  created_at,
}: Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEventV1 & Event) => {
  await upsertProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      identifiantProjet,
      identifiantGestionnaireRéseau,
      référence: référenceDossierRaccordement,
      demandeComplèteRaccordement: {
        dateQualification,
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  );

  await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
    {
      identifiantGestionnaireRéseau,
    },
  );
};
