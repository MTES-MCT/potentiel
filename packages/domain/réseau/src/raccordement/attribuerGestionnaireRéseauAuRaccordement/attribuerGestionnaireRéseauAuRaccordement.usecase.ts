import { Message, MessageHandler, mediator } from 'mediateur';
import { AttribuerGestionnaireRéseauAuRaccordementCommand } from './attribuerGestionnaireRéseauAuRaccordement.command';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type AttribuerGestionnaireRéseauAuRaccordementUseCase = Message<
  'Réseau.Gestionnaire.UseCase.AttribuerGestionnaireRéseauAuRaccordement',
  {
    identifiantGestionnaireRéseauValue: string;
    identifiantProjetValue: string;
  }
>;

export const registerAttribuerGestionnaireRéseauAuRaccordementUseCase = () => {
  const handler: MessageHandler<AttribuerGestionnaireRéseauAuRaccordementUseCase> = async ({
    identifiantGestionnaireRéseauValue,
    identifiantProjetValue,
  }) => {
    await mediator.send<AttribuerGestionnaireRéseauAuRaccordementCommand>({
      type: 'Réseau.Gestionnaire.Command.AttribuerGestionnaireRéseauAuRaccordement',
      data: {
        identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
          identifiantGestionnaireRéseauValue,
        ),
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjetValue),
      },
    });
  };

  mediator.register(
    'Réseau.Gestionnaire.UseCase.AttribuerGestionnaireRéseauAuRaccordement',
    handler,
  );
};
