import { type Message, type MessageHandler, mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Role } from '@potentiel-domain/utilisateur';

import { IdentifiantProjet } from '../../../..';
import type { ModifierGestionnaireRéseauRaccordementCommand } from './modifierGestionnaireRéseauRaccordement.command';

export type ModifierGestionnaireRéseauRaccordementUseCase = Message<
  'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
  {
    identifiantGestionnaireRéseauValue: string;
    identifiantProjetValue: string;
    rôleValue: string;
  }
>;

export const registerModifierGestionnaireRéseauRaccordementUseCase = () => {
  const runner: MessageHandler<ModifierGestionnaireRéseauRaccordementUseCase> = async ({
    identifiantGestionnaireRéseauValue,
    identifiantProjetValue,
    rôleValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantGestionnaireRéseau =
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseauValue,
      );
    const rôle = Role.convertirEnValueType(rôleValue);
    await mediator.send<ModifierGestionnaireRéseauRaccordementCommand>({
      type: 'Lauréat.Raccordement.Command.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantProjet,
        identifiantGestionnaireRéseau,
        rôle,
      },
    });
  };
  mediator.register('Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement', runner);
};
