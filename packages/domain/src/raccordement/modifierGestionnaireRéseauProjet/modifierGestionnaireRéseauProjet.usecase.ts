import {
  GestionnaireNonRéférencéError,
  newConsulterGestionnaireRéseauQuery,
} from '../../gestionnaireRéseau';
import {
  ModifierGestionnaireRéseauProjetCommand,
  newModifierGestionnaireRéseauProjetCommand,
} from './modifierGestionnaireRéseauProjet.command';
import { Message, MessageHandler, mediator, newMessage } from 'mediateur';

const MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE = Symbol(
  'MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE',
);

type ModifierGestionnaireRéseauProjetUseCaseData = ModifierGestionnaireRéseauProjetCommand['data'];

type ModifierGestionnaireRéseauProjetUseCase = Message<
  typeof MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE,
  ModifierGestionnaireRéseauProjetUseCaseData
>;

export const registerModifierGestionnaireRéseauProjetUseCase = () => {
  const runner: MessageHandler<ModifierGestionnaireRéseauProjetUseCase> = async ({
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
  mediator.register(MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE, runner);
};

export const newModifierGestionnaireRéseauProjetUseCase = newMessage(
  MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE,
);
