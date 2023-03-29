import { Publish, LoadAggregate, CommandHandlerFactory } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';
import {
  createGestionnaireRéseauAggregateId,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau.aggregate';
import { GestionnaireRéseauAjoutéEvent } from './gestionnaireRéseauAjouté.event';
import { GestionnaireRéseauDéjàExistantError } from './gestionnaireRéseauDéjàExistant.error';

type AjouterGestionnaireRéseauCommand = {
  codeEIC: string;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: { format: string; légende: string };
};

type AjouterGestionnaireRéseauDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const ajouterGestionnaireRéseauCommandHandlerFactory: CommandHandlerFactory<
  AjouterGestionnaireRéseauCommand,
  AjouterGestionnaireRéseauDependencies
> = ({ publish, loadAggregate }) => {
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
