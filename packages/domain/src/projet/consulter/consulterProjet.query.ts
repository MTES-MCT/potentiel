import { Find } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '..';
import { ProjetReadModel } from '../projet.readModel';
import { isNone } from '@potentiel/monads';
import { Message, MessageHandler, mediator } from 'mediateur';

const CONSULTER_PROJET = Symbol('CONSULTER_PROJET');

export type ConsulterProjetQuery = Message<
  typeof CONSULTER_PROJET,
  {
    identifiantProjet: IdentifiantProjet;
  },
  ProjetReadModel
>;

type ConsulterProjetDependencies = {
  find: Find;
};

export const registerConsulterProjetQuery = ({ find }: ConsulterProjetDependencies) => {
  const queryHandler: MessageHandler<ConsulterProjetQuery> = async ({ identifiantProjet }) => {
    const result = await find<ProjetReadModel>(
      `projet#${formatIdentifiantProjet(identifiantProjet)}`,
    );

    if (isNone(result)) {
      return { type: 'projet' };
    }

    return result;
  };

  mediator.register(CONSULTER_PROJET, queryHandler);
};

export const createConsulterProjetQuery = (
  queryData: ConsulterProjetQuery['data'],
): ConsulterProjetQuery => ({
  type: CONSULTER_PROJET,
  data: { ...queryData },
});
