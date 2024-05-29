import { Message, MessageHandler, mediator } from 'mediateur';
import { AttribuerGestionnaireRéseauCommand } from './attribuerGestionnaireRéseau.command';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { IdentifiantProjet } from '@potentiel-domain/common';

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
    await mediator.send<AttribuerGestionnaireRéseauCommand>({
      type: 'Réseau.Raccordement.Command.AttribuerGestionnaireRéseau',
      data: {
        identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
          identifiantGestionnaireRéseauValue,
        ),
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
      },
    });
  };

  mediator.register('Réseau.Raccordement.UseCase.AttribuerGestionnaireRéseau', handler);
};
