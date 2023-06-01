import { GestionnaireRéseauReadModel } from '../query/gestionnaireRéseau.readModel';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import {
  ListerGestionnaireRéseauQuery,
  buildListerGestionnaireRéseauQuery,
} from '../query/lister/listerGestionnaireRéseau.query';

type ListerGestionnaireRéseauUseCaseData = ListerGestionnaireRéseauQuery['data'];
type ListerGestionnaireRéseauUseCaseResult = ReadonlyArray<GestionnaireRéseauReadModel>;

export type ListerGestionnaireRéseauUseCase = Message<
  'LISTER_GESTIONNAIRE_RÉSEAU_USECASE',
  ListerGestionnaireRéseauUseCaseData,
  ListerGestionnaireRéseauUseCaseResult
>;

export const registerListerGestionnaireRéseauUseCase = () => {
  const handler: MessageHandler<ListerGestionnaireRéseauUseCase> = async () => {
    return mediator.send(buildListerGestionnaireRéseauQuery({}));
  };

  mediator.register('LISTER_GESTIONNAIRE_RÉSEAU_USECASE', handler);
};

export const buildListerGestionnaireRéseauUseCase =
  getMessageBuilder<ListerGestionnaireRéseauUseCase>('LISTER_GESTIONNAIRE_RÉSEAU_USECASE');
