import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { DateTime } from '@potentiel-domain/common';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

export const demandeComplèteDeRaccordementTransmiseV2Projector = async ({
  payload: {
    identifiantProjet,
    identifiantGestionnaireRéseau,
    référenceDossierRaccordement,
    dateQualification,
    accuséRéception,
  },
  created_at,
  version,
}: Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEventV2 & Event) => {
  await upsertProjection<Lauréat.Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${référenceDossierRaccordement}`,
    {
      identifiantProjet,
      identifiantGestionnaireRéseau,
      référence: référenceDossierRaccordement,
      demandeComplèteRaccordement: {
        dateQualification,
        accuséRéception: {
          format: accuséRéception.format,
        },
      },
      miseÀJourLe: DateTime.convertirEnValueType(created_at).formatter(),
    },
  );

  /**
   *
   * Contexte :
   * - Avant c'était la création de la demande complète de raccordement qui initialisait la projection raccordement.
   * - Aujourd'hui c'est l'attribution du GRD qui est systématiquement le premier évènement qui initialise le stream.
   *
   * On vérifie le numéro de version pour ne pas risquer d'écraser la donnée optionnelle dans le cas où ce n'est pas le premier évenement du stream
   *
   */
  if (version === 1) {
    await upsertProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      {
        identifiantProjet,
        identifiantGestionnaireRéseau,
      },
    );
    return;
  }

  await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
    { identifiantGestionnaireRéseau },
  );
};
