import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantGestionnaireRéseau } from '..';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type AttribuerGestionnaireRéseauAUnProjetUseCase = Message<
  'Réseau.Gestionnaire.UseCase.AttribuerGestionnaireRéseauAUnProjet',
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
    isValidatedByPorteurValue: boolean;
  }
>;

export const registerAttribuerGestionnaireRéseauAUnProjetUseCase = () => {
  const handler: MessageHandler<AttribuerGestionnaireRéseauAUnProjetUseCase> = async ({
    identifiantGestionnaireRéseauValue,
    projet,
    isValidatedByPorteurValue,
  }) => {
    const commandParams = {
      identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseauValue,
      ),
      projet: {
        ...projet,
        identifiantProjet: IdentifiantProjet.convertirEnValueType(projet.identifiantProjetValue),
      },
      isValidatedByPorteur: isValidatedByPorteurValue,
    };

    // appeler la commande
  };

  mediator.register('Réseau.Gestionnaire.UseCase.AttribuerGestionnaireRéseauAUnProjet', handler);
};
