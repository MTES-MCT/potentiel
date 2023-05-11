import { CommandHandler } from '@potentiel/core-domain';
import {
  GestionnaireNonRéférencéError,
  createConsulterGestionnaireRéseauQuery,
} from '../../gestionnaireRéseau';
import { ModifierGestionnaireRéseauProjetCommand } from './modifierGestionnaireRéseauProjet.command';
import { mediator } from 'mediateur';

type Dependencies = {
  modifierGestionnaireRéseauProjetCommand: CommandHandler<ModifierGestionnaireRéseauProjetCommand>;
};

export const modifierGestionnaireRéseauProjetUseCaseFactory =
  ({ modifierGestionnaireRéseauProjetCommand }: Dependencies) =>
  async ({
    identifiantGestionnaireRéseau,
    identifiantProjet,
  }: ModifierGestionnaireRéseauProjetCommand) => {
    const gestionnaireRéseau = await mediator.send(
      createConsulterGestionnaireRéseauQuery({
        codeEIC: identifiantGestionnaireRéseau,
      }),
    );

    if (!gestionnaireRéseau) {
      throw new GestionnaireNonRéférencéError();
    }

    await modifierGestionnaireRéseauProjetCommand({
      identifiantProjet,
      identifiantGestionnaireRéseau,
    });
  };
