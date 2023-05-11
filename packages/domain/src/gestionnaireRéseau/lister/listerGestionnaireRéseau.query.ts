import { List } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '../gestionnaireRéseau.readModel';
import { Message, MessageHandler, mediator } from 'mediateur';

const LISTER_GESTIONNAIRE_RÉSEAU = Symbol('LISTER_GESTIONNAIRE_RÉSEAU');

export type ListerGestionnaireRéseauQuery = Message<
  typeof LISTER_GESTIONNAIRE_RÉSEAU,
  {},
  ReadonlyArray<GestionnaireRéseauReadModel>
>;

type ListerGestionnaireRéseauDependencies = {
  list: List;
};

export const registerListerGestionnaireRéseauQuery = ({
  list,
}: ListerGestionnaireRéseauDependencies) => {
  const commandHandler: MessageHandler<ListerGestionnaireRéseauQuery> = async () =>
    list<GestionnaireRéseauReadModel>({ type: 'gestionnaire-réseau', orderBy: 'raisonSociale' });
  mediator.register(LISTER_GESTIONNAIRE_RÉSEAU, commandHandler);
};

export const createListerGestionnaireRéseauQuery = (): ListerGestionnaireRéseauQuery => ({
  type: LISTER_GESTIONNAIRE_RÉSEAU,
  data: {},
});
