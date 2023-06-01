import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import {
  ConsulterGestionnaireRéseauQuery,
  buildConsulterGestionnaireRéseauQuery,
} from '../query/consulter/consulterGestionnaireRéseau.query';
import { GestionnaireRéseauReadModel } from '../query/gestionnaireRéseau.readModel';

type ConsulterGestionnaireRéseauUseCaseData = ConsulterGestionnaireRéseauQuery['data'];
type ConsulterGestionnaireRéseauUseCaseResult = GestionnaireRéseauReadModel;

export type ConsulterGestionnaireRéseauUseCase = Message<
  'CONSULTER_GESTIONNAIRE_RÉSEAU_USECASE',
  ConsulterGestionnaireRéseauUseCaseData,
  ConsulterGestionnaireRéseauUseCaseResult
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
