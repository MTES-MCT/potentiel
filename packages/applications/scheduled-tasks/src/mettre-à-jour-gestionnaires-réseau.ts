import { mediator } from 'mediateur';

import {
  GestionnaireRéseau,
  registerRéseauQueries,
  registerRéseauUseCases,
} from '@potentiel-domain/reseau';

import {
  GestionnaireRéseauProjector,
  RaccordementProjector,
} from '@potentiel-applications/projectors';
import { OreGestionnaire, getAllGRDs } from '@potentiel-infrastructure/ore-client';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  findProjection,
  listProjection,
  listProjectionV2,
} from '@potentiel-infrastructure/pg-projections';
import { getLogger } from '@potentiel-libraries/monitoring';

type Params = {
  gestionnairesFromORE: OreGestionnaire;
  gestionnairesRéseau: GestionnaireRéseau.ListerGestionnaireRéseauReadModel;
};

async function updateExistingGestionnairesDeRéseauContactInformations({
  gestionnairesFromORE,
  gestionnairesRéseau,
}: Params) {}

async function addNewGestionnairesDeRéseau({ gestionnairesFromORE, gestionnairesRéseau }: Params) {
  const gestionnairesRéseauEICFromDb = gestionnairesRéseau.items.map(
    (gestionnaire) => gestionnaire.identifiantGestionnaireRéseau.codeEIC,
  );

  const newGestionnairesRéseaux = gestionnairesFromORE.filter(
    (gestionnaire) => !gestionnairesRéseauEICFromDb.includes(gestionnaire.codeEIC),
  );

  getLogger().debug(
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
        // contactInformationsValue: {
        //   emailValue: newGestionnaireRéseaux.contactInformations?.email ?? '',
        //   phoneValue: newGestionnaireRéseaux.contactInformations?.phone ?? '',
        // },
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

    GestionnaireRéseauProjector.register();
    RaccordementProjector.register();

    const gestionnairesFromORE = await getAllGRDs();

    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      });

    await updateExistingGestionnairesDeRéseauContactInformations({
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
