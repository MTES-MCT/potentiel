import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';
import { AjouterTâcheCommand } from '@potentiel-domain/tache';

import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import * as TypeTâcheRaccordement from '../typeTâcheRaccordement.valueType';

import { ModifierGestionnaireRéseauRaccordementCommand } from './modifierGestionnaireRéseauRaccordement.command';

export type ModifierGestionnaireRéseauRaccordementUseCase = Message<
  'Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
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
    const identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseauValue,
    );
    const rôle = Role.convertirEnValueType(rôleValue);
    await mediator.send<ModifierGestionnaireRéseauRaccordementCommand>({
      type: 'Réseau.Raccordement.Command.ModifierGestionnaireRéseauRaccordement',
      data: {
        identifiantProjet,
        identifiantGestionnaireRéseau,
        rôle,
      },
    });

    if (!identifiantGestionnaireRéseau.estÉgaleÀ(IdentifiantGestionnaireRéseau.inconnu)) {
      await mediator.send<AjouterTâcheCommand>({
        type: 'System.Tâche.Command.AjouterTâche',
        data: {
          identifiantProjet,
          typeTâche: TypeTâcheRaccordement.raccordementGestionnaireRéseauInconnuAttribué,
        },
      });
    }
  };
  mediator.register('Réseau.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement', runner);
};
