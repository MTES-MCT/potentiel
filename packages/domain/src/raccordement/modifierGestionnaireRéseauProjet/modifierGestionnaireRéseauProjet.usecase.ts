import {
  GestionnaireNonRéférencéError,
  newConsulterGestionnaireRéseauQuery,
} from '../../gestionnaireRéseau';
import {
  ModifierGestionnaireRéseauProjetCommand,
  newModifierGestionnaireRéseauProjetCommand,
} from './modifierGestionnaireRéseauProjet.command';
import { mediator } from 'mediateur';

export const modifierGestionnaireRéseauProjetUseCase = async ({
  identifiantGestionnaireRéseau,
  identifiantProjet,
}: ModifierGestionnaireRéseauProjetCommand['data']) => {
  const gestionnaireRéseau = await mediator.send(
    newConsulterGestionnaireRéseauQuery({
      codeEIC: identifiantGestionnaireRéseau,
    }),
  );

  if (!gestionnaireRéseau) {
    throw new GestionnaireNonRéférencéError();
  }

  await mediator.send(
    newModifierGestionnaireRéseauProjetCommand({
      identifiantProjet,
      identifiantGestionnaireRéseau,
    }),
  );
};
