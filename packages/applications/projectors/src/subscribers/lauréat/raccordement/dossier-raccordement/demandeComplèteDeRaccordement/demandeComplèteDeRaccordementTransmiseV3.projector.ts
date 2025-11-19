import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

export const demandeComplèteDeRaccordementTransmiseV3Projector = async ({
  payload: {
    identifiantProjet,
    identifiantGestionnaireRéseau,
    référenceDossierRaccordement,
    dateQualification,
    accuséRéception,
    transmiseLe,
    transmisePar,
  },
  created_at,
}: Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEvent & Event) => {
  await upsertProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      identifiantProjet,
      identifiantGestionnaireRéseau,
      référence: référenceDossierRaccordement,
      demandeComplèteRaccordement: {
        dateQualification,
        accuséRéception: accuséRéception
          ? {
              format: accuséRéception.format,
            }
          : undefined,
        transmiseLe,
        transmisePar,
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  );

  await upsertProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
    { identifiantProjet, identifiantGestionnaireRéseau },
  );
};
