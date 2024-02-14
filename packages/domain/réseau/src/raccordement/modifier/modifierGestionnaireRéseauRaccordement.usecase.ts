import { Message, MessageHandler, mediator } from 'mediateur';
import { ModifierGestionnaireRéseauRaccordementCommand } from './modifierGestionnaireRéseauRaccordement.command';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

export type ModifierGestionnaireRéseauRaccordementUseCase = Message<
  'MODIFIER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_USE_CASE',
  {
    identifiantGestionnaireRéseauValue: string;
    identifiantProjetValue: string;
  }
>;

export const registerModifierGestionnaireRéseauRaccordementUseCase = () => {
  const runner: MessageHandler<ModifierGestionnaireRéseauRaccordementUseCase> = async ({
    identifiantGestionnaireRéseauValue,
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseauValue,
    );
    await mediator.send<ModifierGestionnaireRéseauRaccordementCommand>({
      type: 'MODIFIER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_COMMAND',
      data: {
        identifiantProjet,
        identifiantGestionnaireRéseau,
      },
    });
  };
  mediator.register('MODIFIER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_USE_CASE', runner);
};
