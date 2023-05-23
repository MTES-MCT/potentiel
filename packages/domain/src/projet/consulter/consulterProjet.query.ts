import { Find } from '@potentiel/core-domain';
import { ProjetReadModel } from '../projet.readModel';
import { isNone } from '@potentiel/monads';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { IdentifiantProjet, formatIdentifiantProjet } from '../identifiantProjet';

export type ConsulterProjetQuery = Message<
  'CONSULTER_PROJET',
  {
    identifiantProjet: IdentifiantProjet;
  },
  ProjetReadModel
>;

export type ConsulterProjetDependencies = {
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

  mediator.register('CONSULTER_PROJET', queryHandler);
};

export const buildConsulterProjetQuery =
  getMessageBuilder<ConsulterProjetQuery>('CONSULTER_PROJET');
