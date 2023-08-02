import { Message, MessageHandler, mediator } from 'mediateur';
import { ModifierGestionnaireRéseauProjetCommand } from './modifierGestionnaireRéseauProjet.command';
import { ProjetCommand } from '../../projet.command';

type ModifierGestionnaireRéseauProjetUseCaseData = ModifierGestionnaireRéseauProjetCommand['data'];

export type ModifierGestionnaireRéseauProjetUseCase = Message<
  'MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET_USE_CASE',
  ModifierGestionnaireRéseauProjetUseCaseData
>;

export const registerModifierGestionnaireRéseauProjetUseCase = () => {
  const runner: MessageHandler<ModifierGestionnaireRéseauProjetUseCase> = async ({
    identifiantGestionnaireRéseau,
    identifiantProjet,
  }) => {
    await mediator.send<ProjetCommand>({
      type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET',
      data: {
        identifiantProjet,
        identifiantGestionnaireRéseau,
      },
    });
  };
  mediator.register('MODIFIER_GESTIONNAIRE_RÉSEAU_PROJET_USE_CASE', runner);
};
