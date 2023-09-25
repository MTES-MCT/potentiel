import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
} from '@potentiel/domain';

import { ProjetReadModel, ProjetReadModelKey } from '../projet.readModel';
import { Message, MessageHandler, mediator } from 'mediateur';
import { Find } from '@potentiel/core-domain-views';
import { Option } from '@potentiel/monads';

export type ConsulterProjetQuery = Message<
  'CONSULTER_PROJET',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<ProjetReadModel>
>;

export type ConsulterProjetDependencies = {
  find: Find;
};

export const registerConsulterProjetQuery = ({ find }: ConsulterProjetDependencies) => {
  const handler: MessageHandler<ConsulterProjetQuery> = async ({ identifiantProjet }) => {
    const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);
    const key: ProjetReadModelKey = `projet|${identifiantProjetValueType.formatter()}`;

    return await find<ProjetReadModel>(key);
  };

  mediator.register('CONSULTER_PROJET', handler);
};
