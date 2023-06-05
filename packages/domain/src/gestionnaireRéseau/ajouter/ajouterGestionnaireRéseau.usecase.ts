import { Message, MessageHandler, mediator } from 'mediateur';
import { GestionnaireRéseauUseCase } from '../gestionnaireRéseau.command';
import { AjouterGestionnaireRéseauCommand } from './ajouterGestionnaireRéseau.command';

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
  }) => {
    await mediator.send<GestionnaireRéseauUseCase>({
      type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
      data: {
        codeEIC,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      },
    });
  };

  mediator.register('AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE', handler);
};
