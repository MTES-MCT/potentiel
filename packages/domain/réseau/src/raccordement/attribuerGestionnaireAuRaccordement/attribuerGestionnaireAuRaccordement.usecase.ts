import { Message, MessageHandler, mediator } from 'mediateur';
import { AttribuerGestionnaireAuRaccordementCommand } from './attribuerGestionnaireAuRaccordement.command';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type AttribuerGestionnaireAuRaccordementUseCase = Message<
  'Réseau.Gestionnaire.UseCase.AttribuerGestionnaireAuRaccordement',
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

export const registerAttribuerGestionnaireAuRaccordementUseCase = () => {
  const handler: MessageHandler<AttribuerGestionnaireAuRaccordementUseCase> = async ({
    identifiantGestionnaireRéseauValue,
    projet,
  }) => {
    await mediator.send<AttribuerGestionnaireAuRaccordementCommand>({
      type: 'Réseau.Gestionnaire.Command.AttribuerGestionnaireAuRaccordement',
      data: {
        identifiantGestionnaireRéseauValue: IdentifiantGestionnaireRéseau.convertirEnValueType(
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

  mediator.register('Réseau.Gestionnaire.UseCase.AttribuerGestionnaireAuRaccordement', handler);
};
