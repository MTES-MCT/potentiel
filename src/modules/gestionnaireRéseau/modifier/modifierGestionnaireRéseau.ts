import { Publish } from '@potentiel/core-domain';

type ModifierGestionnaireRéseauCommand = { codeEIC: string; raisonSociale?: string };

type ModifierGestionnaireRéseauDependencies = { publish: Publish };

type CommandHandler = (command: ModifierGestionnaireRéseauCommand) => Promise<void>;

type ModifierGestionnaireRéseauFactory = (
  dependencies: ModifierGestionnaireRéseauDependencies,
) => CommandHandler;

export const modifierGestionnaireRéseauFactory: ModifierGestionnaireRéseauFactory =
  ({ publish }) =>
  async ({ codeEIC, raisonSociale }) => {
    return Promise.reject(new Error('Not implemented'));
  };
