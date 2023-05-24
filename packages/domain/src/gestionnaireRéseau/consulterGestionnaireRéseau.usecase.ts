import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { buildConsulterGestionnaireRéseauQuery } from './consulter/consulterGestionnaireRéseau.query';
import { GestionnaireRéseauReadModel } from './gestionnaireRéseau.readModel';
import { IdentifiantGestionnaireRéseau } from './identifiantGestionnaireRéseau';

export type ConsulterGestionnaireRéseauUseCase = Message<
  'CONSULTER_GESTIONNAIRE_RÉSEAU_USECASE',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau;
  },
  GestionnaireRéseauReadModel
>;

export const registerConsulterGestionnaireRéseauUseCase = () => {
  const runner: MessageHandler<ConsulterGestionnaireRéseauUseCase> = async ({
    identifiantGestionnaireRéseau,
  }) => {
    return await mediator.send(
      buildConsulterGestionnaireRéseauQuery({
        identifiantGestionnaireRéseau,
      }),
    );
  };

  mediator.register('CONSULTER_GESTIONNAIRE_RÉSEAU_USECASE', runner);
};

export const buildConsulterGestionnaireRéseauUseCase =
  getMessageBuilder<ConsulterGestionnaireRéseauUseCase>('CONSULTER_GESTIONNAIRE_RÉSEAU_USECASE');
