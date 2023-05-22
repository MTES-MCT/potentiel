import { List } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '../gestionnaireRéseau.readModel';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';

const LISTER_GESTIONNAIRE_RÉSEAU = Symbol('LISTER_GESTIONNAIRE_RÉSEAU');

export type ListerGestionnaireRéseauQuery = Message<
  typeof LISTER_GESTIONNAIRE_RÉSEAU,
  {},
  ReadonlyArray<GestionnaireRéseauReadModel>
>;

export type ListerGestionnaireRéseauDependencies = {
  list: List;
};

export const registerListerGestionnaireRéseauQuery = ({
  list,
}: ListerGestionnaireRéseauDependencies) => {
  const commandHandler: MessageHandler<ListerGestionnaireRéseauQuery> = async () =>
    list<GestionnaireRéseauReadModel>({ type: 'gestionnaire-réseau', orderBy: 'raisonSociale' });
  mediator.register(LISTER_GESTIONNAIRE_RÉSEAU, commandHandler);
};

export const buildListerGestionnaireRéseauQuery = getMessageBuilder<ListerGestionnaireRéseauQuery>(
  LISTER_GESTIONNAIRE_RÉSEAU,
);
