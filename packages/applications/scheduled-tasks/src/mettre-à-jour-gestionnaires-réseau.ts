import { mediator } from 'mediateur';

import {
  GestionnaireRéseau,
  registerRéseauQueries,
  registerRéseauUseCases,
} from '@potentiel-domain/reseau';

import { OreGestionnaire, getAllGRDs } from '@potentiel-infrastructure/ore-client';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  findProjection,
  listProjection,
  listProjectionV2,
} from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';

type Params = {
  gestionnairesFromORE: Array<OreGestionnaire>;
  gestionnairesRéseau: GestionnaireRéseau.ListerGestionnaireRéseauReadModel;
};

async function updateExistingGestionnairesDeRéseauContactEmail({
  gestionnairesFromORE,
  gestionnairesRéseau,
}: Params) {
  const gestionnairesRéseauToUpdate = gestionnairesRéseau.items.filter((gestionnaire) => {
    return gestionnairesFromORE.some(
      (g) =>
        g.codeEIC === gestionnaire.identifiantGestionnaireRéseau.codeEIC &&
        g.contactEmail &&
        g.contactEmail !== gestionnaire.contactEmail,
    );
  });

  getLogger().info(
    `[updateGestionnaireDeRéseau] Il y a ${gestionnairesRéseauToUpdate.length} gestionnaires réseau à mettre à jour`,
  );

  for (const gestionnaireRéseauToUpdate of gestionnairesRéseauToUpdate) {
    const siblingOreGestionnaireRéseau = gestionnairesFromORE.find(
      ({ codeEIC }) => codeEIC === gestionnaireRéseauToUpdate.identifiantGestionnaireRéseau.codeEIC,
    );

    await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
      type: 'Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseauValue:
          gestionnaireRéseauToUpdate.identifiantGestionnaireRéseau.codeEIC,
        aideSaisieRéférenceDossierRaccordementValue: {
          expressionReguliereValue:
            gestionnaireRéseauToUpdate.aideSaisieRéférenceDossierRaccordement.expressionReguliere
              .expression,
          légendeValue: gestionnaireRéseauToUpdate.aideSaisieRéférenceDossierRaccordement.légende,
          formatValue: gestionnaireRéseauToUpdate.aideSaisieRéférenceDossierRaccordement.format,
        },
        raisonSocialeValue: gestionnaireRéseauToUpdate.raisonSociale,
        contactEmailValue: siblingOreGestionnaireRéseau?.contactEmail,
      },
    });
  }
}

async function addNewGestionnairesDeRéseau({ gestionnairesFromORE, gestionnairesRéseau }: Params) {
  const gestionnairesRéseauEICFromDb = gestionnairesRéseau.items.map(
    (gestionnaire) => gestionnaire.identifiantGestionnaireRéseau.codeEIC,
  );

  const newGestionnairesRéseaux = gestionnairesFromORE.filter(
    (gestionnaire) => !gestionnairesRéseauEICFromDb.includes(gestionnaire.codeEIC),
  );

  getLogger().info(
    `[updateGestionnaireDeRéseau] Il y a ${newGestionnairesRéseaux.length} nouveaux gestionnaires réseau à ajouter`,
  );

  for (const newGestionnaireRéseaux of newGestionnairesRéseaux) {
    await mediator.send<GestionnaireRéseau.GestionnaireRéseauUseCase>({
      type: 'Réseau.Gestionnaire.UseCase.AjouterGestionnaireRéseau',
      data: {
        aideSaisieRéférenceDossierRaccordementValue: {
          expressionReguliereValue: '',
          formatValue: '',
          légendeValue: '',
        },
        identifiantGestionnaireRéseauValue: newGestionnaireRéseaux.codeEIC,
        raisonSocialeValue: newGestionnaireRéseaux.raisonSociale,
        contactEmailValue: newGestionnaireRéseaux.contactEmail,
      },
    });
  }
}
async function updateGestionnaireDeRéseau() {
  try {
    registerRéseauUseCases({
      loadAggregate,
    });

    registerRéseauQueries({
      list: listProjection,
      listV2: listProjectionV2,
      find: findProjection,
    });

    const gestionnairesFromORE = await getAllGRDs();

    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      });

    await updateExistingGestionnairesDeRéseauContactEmail({
      gestionnairesFromORE,
      gestionnairesRéseau,
    });

    await addNewGestionnairesDeRéseau({
      gestionnairesFromORE,
      gestionnairesRéseau,
    });

    return;
  } catch (error) {
    return getLogger().error(error as Error);
  }
}

updateGestionnaireDeRéseau();
