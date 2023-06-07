import { List } from '../../domainViews.port';
import { GestionnaireRéseauReadModel } from '../gestionnaireRéseau.readModel';
import { Message, MessageHandler, mediator } from 'mediateur';

export type ListerGestionnaireRéseauQuery = Message<
  'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
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
  mediator.register('LISTER_GESTIONNAIRE_RÉSEAU_QUERY', commandHandler);
};
