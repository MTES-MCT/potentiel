import { ProjetReadModel, ProjetReadModelKey } from '../projet.readModel';
import { isNone } from '@potentiel/monads';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Find } from '../../common.port';
import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '@potentiel/domain';

export type ConsulterProjetQuery = Message<
  'CONSULTER_PROJET',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  ProjetReadModel
>;

export type ConsulterProjetDependencies = {
  find: Find;
};

export const registerConsulterProjetQuery = ({ find }: ConsulterProjetDependencies) => {
  const queryHandler: MessageHandler<ConsulterProjetQuery> = async ({ identifiantProjet }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;
    const key: ProjetReadModelKey = `projet#${rawIdentifiantProjet}`;
    const result = await find<ProjetReadModel>(key);

    if (isNone(result)) {
      return { type: 'projet' };
    }

    return result;
  };

  mediator.register('CONSULTER_PROJET', queryHandler);
};

export const buildConsulterProjetQuery =
  getMessageBuilder<ConsulterProjetQuery>('CONSULTER_PROJET');
