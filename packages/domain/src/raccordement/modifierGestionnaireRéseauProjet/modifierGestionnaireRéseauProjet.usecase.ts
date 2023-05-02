import { CommandHandler, QueryHandler } from '@potentiel/core-domain';
import {
  ConsulterGestionnaireRéseauQuery,
  GestionnaireNonRéférencéError,
  GestionnaireRéseauReadModel,
} from '../../gestionnaireRéseau';
import { ModifierGestionnaireRéseauProjetCommand } from './modifierGestionnaireRéseauProjet.command';

type Dependencies = {
  modifierGestionnaireRéseauProjetCommand: CommandHandler<ModifierGestionnaireRéseauProjetCommand>;
  consulterGestionnaireRéseauQuery: QueryHandler<
    ConsulterGestionnaireRéseauQuery,
    GestionnaireRéseauReadModel
  >;
};

export const modifierGestionnaireRéseauProjetUseCaseFactory =
  ({ modifierGestionnaireRéseauProjetCommand, consulterGestionnaireRéseauQuery }: Dependencies) =>
  async ({
    identifiantGestionnaireRéseau,
    identifiantProjet,
  }: ModifierGestionnaireRéseauProjetCommand) => {
    const gestionnaireRéseau = await consulterGestionnaireRéseauQuery({
      codeEIC: identifiantGestionnaireRéseau,
    });

    if (!gestionnaireRéseau) {
      throw new GestionnaireNonRéférencéError();
    }

    await modifierGestionnaireRéseauProjetCommand({
      identifiantProjet,
      identifiantGestionnaireRéseau,
    });
  };
