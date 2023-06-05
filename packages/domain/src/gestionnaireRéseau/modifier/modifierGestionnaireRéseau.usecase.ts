import { Message, MessageHandler, mediator } from 'mediateur';
import { ModifierGestionnaireRéseauCommand } from './modifierGestionnaireRéseau.command';
import { GestionnaireRéseauUseCase } from '../gestionnaireRéseau.command';

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
  }) => {
    return mediator.send<GestionnaireRéseauUseCase>({
      type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE',
      data: {
        identifiantGestionnaireRéseau,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      },
    });
  };

  mediator.register('MODIFIER_GESTIONNAIRE_RÉSEAU_USECASE', runner);
};
