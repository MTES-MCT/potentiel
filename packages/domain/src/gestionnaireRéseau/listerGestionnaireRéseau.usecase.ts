import { GestionnaireRéseauReadModel } from './gestionnaireRéseau.readModel';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { buildListerGestionnaireRéseauQuery } from './lister/listerGestionnaireRéseau.query';

export type ListerGestionnaireRéseauUseCase = Message<
  'LISTER_GESTIONNAIRE_RÉSEAU_USECASE',
  {},
  ReadonlyArray<GestionnaireRéseauReadModel>
>;

export const registerListerGestionnaireRéseauUseCase = () => {
  const handler: MessageHandler<ListerGestionnaireRéseauUseCase> = async () => {
    return mediator.send(buildListerGestionnaireRéseauQuery({}));
  };

  mediator.register('LISTER_GESTIONNAIRE_RÉSEAU_USECASE', handler);
};

export const buildListerGestionnaireRéseauUseCase =
  getMessageBuilder<ListerGestionnaireRéseauUseCase>('LISTER_GESTIONNAIRE_RÉSEAU_USECASE');
