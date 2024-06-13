import { Message, MessageHandler, mediator } from 'mediateur';
import { List } from '@potentiel-domain/core';
import { AppelOffreEntity } from '../appelOffre.entity';

type AppelOffreListItemReadModel = {
  id: string;
};

export type ListerAppelOffreReadModel = {
  items: ReadonlyArray<AppelOffreListItemReadModel>;
};

export type ListerAppelOffreQuery = Message<
  'AppelOffre.Query.ListerAppelOffre',
  {},
  ListerAppelOffreReadModel
>;

export type ListerAppelOffreDependencies = {
  list: List;
};

export const registerListerAppelOffreQuery = ({ list }: ListerAppelOffreDependencies) => {
  const handler: MessageHandler<ListerAppelOffreQuery> = async () => {
    const result = await list<AppelOffreEntity>('appel-offre', {
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
