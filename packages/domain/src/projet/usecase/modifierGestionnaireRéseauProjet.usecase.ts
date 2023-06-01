import { buildConsulterGestionnaireRéseauQuery } from '../../gestionnaireRéseau/query/consulter/consulterGestionnaireRéseau.query';
import {
  ModifierGestionnaireRéseauProjetCommand,
  buildModifierGestionnaireRéseauProjetCommand,
} from '../command/modifierGestionnaireRéseau/modifierGestionnaireRéseauProjet.command';
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
  }) => {
    const gestionnaireRéseau = await mediator.send(
      buildConsulterGestionnaireRéseauQuery({
        identifiantGestionnaireRéseau,
      }),
    );

    await mediator.send(
      buildModifierGestionnaireRéseauProjetCommand({
        identifiantProjet,
        identifiantGestionnaireRéseau: {
          codeEIC: gestionnaireRéseau.codeEIC,
        },
      }),
    );
  };
  mediator.register('MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE', runner);
};

export const buildModifierGestionnaireRéseauProjetUseCase =
  getMessageBuilder<ModifierGestionnaireRéseauProjetUseCase>(
    'MODIFIER_GESTIONNAIRE_RESEAU_PROJET_USE_CASE',
  );
