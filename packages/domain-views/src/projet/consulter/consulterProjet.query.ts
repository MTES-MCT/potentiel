import { Find } from '@potentiel/core-domain';
import { ProjetReadModel, ProjetReadModelKey } from '../projet.readModel';
import { isNone } from '@potentiel/monads';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';

export type ConsulterProjetQuery = Message<
  'CONSULTER_PROJET',
  {
    appelOffre: string;
    période: string;
    famille?: string;
    numéroCRE: string;
  },
  ProjetReadModel
>;

export type ConsulterProjetDependencies = {
  find: Find;
};

export const registerConsulterProjetQuery = ({ find }: ConsulterProjetDependencies) => {
  const queryHandler: MessageHandler<ConsulterProjetQuery> = async ({
    appelOffre,
    numéroCRE,
    période,
    famille = '',
  }) => {
    const key: ProjetReadModelKey = `projet#${appelOffre}#${période}#${famille}#${numéroCRE}`;
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
