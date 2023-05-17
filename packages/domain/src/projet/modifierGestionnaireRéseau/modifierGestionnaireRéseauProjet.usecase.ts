import {
  GestionnaireNonRéférencéError,
  buildConsulterGestionnaireRéseauQuery,
} from '../../gestionnaireRéseau';
import {
  ModifierGestionnaireRéseauProjetCommand,
  buildModifierGestionnaireRéseauProjetCommand,
} from './modifierGestionnaireRéseauProjet.command';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';

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
      buildConsulterGestionnaireRéseauQuery({
        codeEIC: identifiantGestionnaireRéseau,
      }),
    );

    if (!gestionnaireRéseau) {
      throw new GestionnaireNonRéférencéError();
    }

    await mediator.send(
      buildModifierGestionnaireRéseauProjetCommand({
        identifiantProjet,
        identifiantGestionnaireRéseau,
      }),
    );
  };
  mediator.register(MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE, runner);
};

export const buildModifierGestionnaireRéseauProjetUseCase = getMessageBuilder(
  MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE,
);
