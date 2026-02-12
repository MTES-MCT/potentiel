import { Where } from '@potentiel-domain/entity';
import { Lauréat } from '@potentiel-domain/projet';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  updateManyProjections,
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

export const gestionnaireRéseauInconnuAttribuéV1Projector = async ({
  payload: { identifiantProjet },
  version,
}: Lauréat.Raccordement.GestionnaireRéseauInconnuAttribuéEvent & Event) => {
  const identifiantGestionnaireRéseauInconnu =
    GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.codeEIC;

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
        identifiantGestionnaireRéseau: identifiantGestionnaireRéseauInconnu,
      },
    );
  } else {
    await updateOneProjection<Lauréat.Raccordement.RaccordementEntity>(
      `raccordement|${identifiantProjet}`,
      {
        identifiantProjet,
        identifiantGestionnaireRéseau: identifiantGestionnaireRéseauInconnu,
      },
    );
  }

  await updateManyProjections<Lauréat.Raccordement.DossierRaccordementEntity>(
    'dossier-raccordement',
    { identifiantProjet: Where.equal(identifiantProjet) },
    { identifiantGestionnaireRéseau: identifiantGestionnaireRéseauInconnu },
  );
};
