import { Message, MessageHandler, mediator } from 'mediateur';

import { List, Where } from '@potentiel-domain/entity';

import { AppelOffreEntity } from '../appelOffre.entity.js';

export type AppelOffreListItemReadModel = AppelOffreEntity;

export type ListerAppelOffreReadModel = {
  items: ReadonlyArray<AppelOffreListItemReadModel>;
};

export type ListerAppelOffreQuery = Message<
  'AppelOffre.Query.ListerAppelOffre',
  {
    cycle?: AppelOffreEntity['cycleAppelOffre'];
  },
  ListerAppelOffreReadModel
>;

export type ListerAppelOffreDependencies = {
  list: List;
};

export const registerListerAppelOffreQuery = ({ list }: ListerAppelOffreDependencies) => {
  const handler: MessageHandler<ListerAppelOffreQuery> = async ({ cycle }) => {
    const result = await list<AppelOffreEntity>('appel-offre', {
      where: {
        cycleAppelOffre: Where.equal(cycle),
      },
      orderBy: {
        id: 'ascending',
      },
    });

    return {
      ...result,
      items: result.items,
    };
  };

  mediator.register('AppelOffre.Query.ListerAppelOffre', handler);
};
