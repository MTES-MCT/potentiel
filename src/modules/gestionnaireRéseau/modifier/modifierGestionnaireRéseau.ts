import { Publish } from '@potentiel/core-domain';
import { createGestionnaireRéseauAggregateId } from '../gestionnaireRéseauAggregateId';
import { GestionnaireRéseauModifiéEvent } from './gestionnaireRéseauModifiéEvent';

type ModifierGestionnaireRéseauCommand = { codeEIC: string; raisonSociale: string };

type ModifierGestionnaireRéseauDependencies = { publish: Publish };

type CommandHandler = (command: ModifierGestionnaireRéseauCommand) => Promise<void>;

type ModifierGestionnaireRéseauFactory = (
  dependencies: ModifierGestionnaireRéseauDependencies,
) => CommandHandler;

export const modifierGestionnaireRéseauFactory: ModifierGestionnaireRéseauFactory =
  ({ publish }) =>
  async ({ codeEIC, raisonSociale }) => {
    const event: GestionnaireRéseauModifiéEvent = {
      type: 'GestionnaireRéseauModifié',
      payload: {
        raisonSociale,
      },
    };
    await publish(createGestionnaireRéseauAggregateId(codeEIC), event);
  };
