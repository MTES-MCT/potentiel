import { Message, MessageHandler, mediator } from 'mediateur';
import { List } from '@potentiel-libraries/projection';
import { AppelOffresProjection } from '../appelOffres.projection';

type AppelOffresListItemReadModel = {
  id: string;
};

export type ListerAppelsOffresReadModel = {
  items: ReadonlyArray<AppelOffresListItemReadModel>;
};

export type ListerAppelOffresQuery = Message<
  'LISTER_APPEL_OFFRES_QUERY',
  {},
  ListerAppelsOffresReadModel
>;

export type ListerAppelOffresDependencies = {
  list: List;
};

export const registerListerAppelOffresQuery = ({ list }: ListerAppelOffresDependencies) => {
  const handler: MessageHandler<ListerAppelOffresQuery> = async () => {
    const result = await list<AppelOffresProjection>({
      type: 'appel-offre',
      orderBy: {
        property: 'id',
        ascending: true,
      },
    });

    return {
      ...result,
      items: result.items,
    };
  };

  mediator.register('LISTER_APPEL_OFFRES_QUERY', handler);
};
