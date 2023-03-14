import { isNone, LoadAggregate, Publish } from '@potentiel/core-domain';
import { loadGestionnaireRéseauAggregateFactory } from '../loadGestionnaireRéseauAggregate.factory';
import { createGestionnaireRéseauAggregateId } from '../gestionnaireRéseauAggregateId';
import { GestionnaireRéseauModifiéEvent } from './gestionnaireRéseauModifiéEvent';
import { GestionnaireRéseauInconnuError } from './gestionnaireRéseauInconnuError';

type ModifierGestionnaireRéseauCommand = { codeEIC: string; raisonSociale: string };

type ModifierGestionnaireRéseauDependencies = { publish: Publish; loadAggregate: LoadAggregate };

type CommandHandler = (command: ModifierGestionnaireRéseauCommand) => Promise<void>;

type ModifierGestionnaireRéseauFactory = (
  dependencies: ModifierGestionnaireRéseauDependencies,
) => CommandHandler;

export const modifierGestionnaireRéseauFactory: ModifierGestionnaireRéseauFactory = ({
  publish,
  loadAggregate,
}) => {
  const loadGestionnaireRéseauAggregate = loadGestionnaireRéseauAggregateFactory({
    loadAggregate,
  });

  return async ({ codeEIC, raisonSociale }) => {
    const aggregate = await loadGestionnaireRéseauAggregate(codeEIC);

    if (isNone(aggregate)) {
      throw new GestionnaireRéseauInconnuError();
    }

    const event: GestionnaireRéseauModifiéEvent = {
      type: 'GestionnaireRéseauModifié',
      payload: {
        raisonSociale,
      },
    };
    await publish(createGestionnaireRéseauAggregateId(codeEIC), event);
  };
};
