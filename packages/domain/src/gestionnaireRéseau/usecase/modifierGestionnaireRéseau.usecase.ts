import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import {
  ModifierGestionnaireRéseauCommand,
  buildModifierGestionnaireRéseauCommand,
} from '../command/modifier/modifierGestionnaireRéseau.command';

type ModifierGestionnaireRéseauUseCaseData = ModifierGestionnaireRéseauCommand['data'];

export type ModifierGestionnaireRéseauUseCase = Message<
  'MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE',
  ModifierGestionnaireRéseauUseCaseData
>;

export const registerModifierGestionnaireRéseauUseCase = () => {
  const runner: MessageHandler<ModifierGestionnaireRéseauUseCase> = async ({
    identifiantGestionnaireRéseau,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement,
    expressionReguliere,
  }) => {
    return mediator.send(
      buildModifierGestionnaireRéseauCommand({
        identifiantGestionnaireRéseau,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
        expressionReguliere,
      }),
    );
  };

  mediator.register('MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE', runner);
};

export const buildModifierGestionnaireRéseauUseCase =
  getMessageBuilder<ModifierGestionnaireRéseauUseCase>('MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE');
