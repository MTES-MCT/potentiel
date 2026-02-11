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
   * Contexte : ici on doit vérifier la version de l'évènement.
   *  - Si le stream a comme premier évènement l'ajout d'une demande complète de raccordement, alors on doit initialiser la projection raccordement
   *  - Si non, alors on doit juste mettre à jour la projection raccordement
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
