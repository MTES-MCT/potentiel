import {
  GestionnaireNonRéférencéError,
  createConsulterGestionnaireRéseauQuery,
} from '../../gestionnaireRéseau';
import {
  ModifierGestionnaireRéseauProjetCommand,
  createModifierGestionnaireRéseauProjetCommand,
} from './modifierGestionnaireRéseauProjet.command';
import { mediator } from 'mediateur';

export const modifierGestionnaireRéseauProjetUseCase = async ({
  identifiantGestionnaireRéseau,
  identifiantProjet,
}: ModifierGestionnaireRéseauProjetCommand['data']) => {
  const gestionnaireRéseau = await mediator.send(
    createConsulterGestionnaireRéseauQuery({
      codeEIC: identifiantGestionnaireRéseau,
    }),
  );

  if (!gestionnaireRéseau) {
    throw new GestionnaireNonRéférencéError();
  }

  await mediator.send(
    createModifierGestionnaireRéseauProjetCommand({
      identifiantProjet,
      identifiantGestionnaireRéseau,
    }),
  );
};
