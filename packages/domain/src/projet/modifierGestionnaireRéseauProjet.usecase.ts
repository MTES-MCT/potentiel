import { buildConsulterGestionnaireRéseauQuery } from '../gestionnaireRéseau';
import { GestionnaireNonRéférencéError } from '../gestionnaireRéseau/consulter/gestionnaireNonRéférencé.error';
import {
  ModifierGestionnaireRéseauProjetCommand,
  buildModifierGestionnaireRéseauProjetCommand,
} from './modifierGestionnaireRéseau/modifierGestionnaireRéseauProjet.command';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';

type ModifierGestionnaireRéseauProjetUseCaseData = ModifierGestionnaireRéseauProjetCommand['data'];

type ModifierGestionnaireRéseauProjetUseCase = Message<
  'MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE',
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
  mediator.register('MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE', runner);
};

export const buildModifierGestionnaireRéseauProjetUseCase = getMessageBuilder(
  'MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE',
);
