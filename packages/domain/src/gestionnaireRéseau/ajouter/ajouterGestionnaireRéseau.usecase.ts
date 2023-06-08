import { Message, MessageHandler, mediator } from 'mediateur';
import { GestionnaireRéseauCommand } from '../gestionnaireRéseau.command';
import { AjouterGestionnaireRéseauCommand } from './ajouterGestionnaireRéseau.command';

type AjouterGestionnaireRéseauUseCaseData = AjouterGestionnaireRéseauCommand['data'];

export type AjouterGestionnaireRéseauUseCase = Message<
  'AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE',
  AjouterGestionnaireRéseauUseCaseData
>;

export const registerAjouterGestionnaireRéseauUseCase = () => {
  const handler: MessageHandler<AjouterGestionnaireRéseauUseCase> = async ({
    aideSaisieRéférenceDossierRaccordement,
    identifiantGestionnaireRéseau,
    raisonSociale,
  }) => {
    await mediator.send<GestionnaireRéseauCommand>({
      type: 'AJOUTER_GESTIONNAIRE_RÉSEAU_COMMAND',
      data: {
        identifiantGestionnaireRéseau,
        raisonSociale,
        aideSaisieRéférenceDossierRaccordement,
      },
    });
  };

  mediator.register('AJOUTER_GESTIONNAIRE_RÉSEAU_USECASE', handler);
};
