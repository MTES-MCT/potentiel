import { Message, MessageHandler, mediator } from 'mediateur';
import { ModifierGestionnaireRéseauRaccordementCommand } from './modifierGestionnaireRéseauRaccordement.command';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

export type ModifierGestionnaireRéseauRaccordementUseCase = Message<
  'Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
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
      type: 'Réseau.Raccordement.Command.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantProjet,
        identifiantGestionnaireRéseau,
      },
    });
  };
  mediator.register('Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement', runner);
};
