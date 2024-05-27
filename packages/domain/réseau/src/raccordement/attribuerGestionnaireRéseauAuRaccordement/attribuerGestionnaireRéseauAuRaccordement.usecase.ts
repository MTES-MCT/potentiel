import { Message, MessageHandler, mediator } from 'mediateur';
import { AttribuerGestionnaireRéseauAuRaccordementCommand } from './attribuerGestionnaireRéseauAuRaccordement.command';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type AttribuerGestionnaireRéseauAuRaccordementUseCase = Message<
  'Réseau.Gestionnaire.UseCase.AttribuerGestionnaireRéseauAuRaccordement',
  {
    identifiantGestionnaireRéseauValue: string;
    projet: {
      identifiantProjetValue: string;
      nomProjetValue: string;
      appelOffreValue: string;
      périodeValue: string;
      familleValue: string;
      numéroCREValue: string;
    };
  }
>;

export const registerAttribuerGestionnaireRéseauAuRaccordementUseCase = () => {
  const handler: MessageHandler<AttribuerGestionnaireRéseauAuRaccordementUseCase> = async ({
    identifiantGestionnaireRéseauValue,
    projet,
  }) => {
    await mediator.send<AttribuerGestionnaireRéseauAuRaccordementCommand>({
      type: 'Réseau.Gestionnaire.Command.AttribuerGestionnaireRéseauAuRaccordement',
      data: {
        identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
          identifiantGestionnaireRéseauValue,
        ),
        projet: {
          identifiantProjet: IdentifiantProjet.convertirEnValueType(projet.identifiantProjetValue),
          nomProjet: projet.nomProjetValue,
          appelOffre: projet.appelOffreValue,
          période: projet.périodeValue,
          famille: projet.familleValue,
          numéroCRE: projet.numéroCREValue,
        },
      },
    });
  };

  mediator.register(
    'Réseau.Gestionnaire.UseCase.AttribuerGestionnaireRéseauAuRaccordement',
    handler,
  );
};
