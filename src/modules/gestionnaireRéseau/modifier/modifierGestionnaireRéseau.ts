import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { loadGestionnaireRéseauAggregateFactory } from '../loadGestionnaireRéseauAggregate.factory';
import { createGestionnaireRéseauAggregateId } from '../gestionnaireRéseauAggregateId';
import { GestionnaireRéseauModifiéEvent } from './gestionnaireRéseauModifiéEvent';

type ModifierGestionnaireRéseauCommand = { codeEIC: string; raisonSociale: string };

type ModifierGestionnaireRéseauDependencies = { publish: Publish; loadAggregate: LoadAggregate };

type CommandHandler = (command: ModifierGestionnaireRéseauCommand) => Promise<void>;

type ModifierGestionnaireRéseauFactory = (
  dependencies: ModifierGestionnaireRéseauDependencies,
) => CommandHandler;

export const modifierGestionnaireRéseauFactory: ModifierGestionnaireRéseauFactory =
  ({ publish, loadAggregate }) =>
  async ({ codeEIC, raisonSociale }) => {
    const aggregateId = createGestionnaireRéseauAggregateId(codeEIC);
    const loadGestionnaireRéseauAggregate = loadGestionnaireRéseauAggregateFactory({
      loadAggregate,
    });
    const aggregate = await loadGestionnaireRéseauAggregate(aggregateId);

    // if (isNone(aggregate)) {
    //   throw new GestionnaireRéseauInconnuError();
    // }

    const event: GestionnaireRéseauModifiéEvent = {
      type: 'GestionnaireRéseauModifié',
      payload: {
        raisonSociale,
      },
    };
    await publish(aggregateId, event);
  };
