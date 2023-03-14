import { Publish, LoadAggregate, CommandHandler, isSome } from '@potentiel/core-domain';
import {
  createGestionnaireRéseauAggregateId,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau.aggregate';
import { GestionnaireRéseauAjoutéEvent } from './gestionnaireRéseauAjouté.event';
import { GestionnaireRéseauDéjàExistantError } from './gestionnaireRéseauDéjàExistant.error';

export const PermissionAjouterGestionnaireRéseau = {
  nom: 'ajouter-gestionnaire-réseau',
  description: 'Ajouter un gestionnaire de réseau',
};

type AjouterGestionnaireRéseauCommand = {
  codeEIC: string;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
};

type AjouterGestionnaireRéseauDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

type AjouterGestionnaireRéseauFactory = (
  dependencies: AjouterGestionnaireRéseauDependencies,
) => CommandHandler<AjouterGestionnaireRéseauCommand>;

export const ajouterGestionnaireRéseauFactory: AjouterGestionnaireRéseauFactory = ({
  publish,
  loadAggregate,
}) => {
  const loadGestionnaireRéseauAggregate = loadGestionnaireRéseauAggregateFactory({
    loadAggregate,
  });

  return async ({ aideSaisieRéférenceDossierRaccordement, codeEIC, raisonSociale }) => {
    const gestionnaireRéseau = await loadGestionnaireRéseauAggregate(codeEIC);

    if (isSome(gestionnaireRéseau)) {
      throw new GestionnaireRéseauDéjàExistantError();
    }

    const event: GestionnaireRéseauAjoutéEvent = {
      type: 'GestionnaireRéseauAjouté',
      payload: {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      },
    };
    await publish(createGestionnaireRéseauAggregateId(codeEIC), event);
  };
};
