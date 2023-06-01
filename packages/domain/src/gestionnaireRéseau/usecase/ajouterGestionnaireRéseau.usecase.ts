import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import {
  AjouterGestionnaireRéseauCommand,
  buildAjouterGestionnaireRéseauCommand,
} from '../command/ajouter/ajouterGestionnaireRéseau.command';

type AjouterGestionnaireRéseauUseCaseData = AjouterGestionnaireRéseauCommand['data'];

export type AjouterGestionnaireRéseauUseCase = Message<
  'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
  AjouterGestionnaireRéseauUseCaseData
>;

export const registerAjouterGestionnaireRéseauUseCase = () => {
  const handler: MessageHandler<AjouterGestionnaireRéseauUseCase> = async ({
    aideSaisieRéférenceDossierRaccordement,
    codeEIC,
    raisonSociale,
    expressionReguliere,
  }) => {
    await mediator.send(
      buildAjouterGestionnaireRéseauCommand({
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
        expressionReguliere,
      }),
    );
  };

  mediator.register('AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE', handler);
};

export const buildAjouterGestionnaireRéseauUseCase =
  getMessageBuilder<AjouterGestionnaireRéseauUseCase>('AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE');
