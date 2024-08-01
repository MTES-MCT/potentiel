import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { AjouterTâcheCommand } from '@potentiel-domain/tache';

import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import * as TypeTâcheRaccordement from '../typeTâcheRaccordement.valueType';

import { AttribuerGestionnaireRéseauCommand } from './attribuerGestionnaireRéseau.command';

export type AttribuerGestionnaireRéseauUseCase = Message<
  'Réseau.Raccordement.UseCase.AttribuerGestionnaireRéseau',
  {
    identifiantGestionnaireRéseauValue: string;
    identifiantProjetValue: string;
  }
>;

export const registerAttribuerGestionnaireRéseauUseCase = () => {
  const handler: MessageHandler<AttribuerGestionnaireRéseauUseCase> = async ({
    identifiantGestionnaireRéseauValue,
    identifiantProjetValue,
  }) => {
    const identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseauValue,
    );
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    await mediator.send<AttribuerGestionnaireRéseauCommand>({
      type: 'Réseau.Raccordement.Command.AttribuerGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseau,
        identifiantProjet,
      },
    });

    if (identifiantGestionnaireRéseau.estÉgaleÀ(IdentifiantGestionnaireRéseau.inconnu)) {
      await mediator.send<AjouterTâcheCommand>({
        type: 'System.Tâche.Command.AjouterTâche',
        data: {
          identifiantProjet,
          typeTâche: TypeTâcheRaccordement.gestionnaireRéseauInconnuAttribué.type,
        },
      });
    }
  };

  mediator.register('Réseau.Raccordement.UseCase.AttribuerGestionnaireRéseau', handler);
};
