import { Message, MessageHandler, mediator } from 'mediateur';

import { Find } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';

import { AppelOffreReadModel, AppelOffreEntity } from '../appelOffre.entity.js';

export type ConsulterAppelOffreReadModel = AppelOffreReadModel;

export type ConsulterAppelOffreQuery = Message<
  'AppelOffre.Query.ConsulterAppelOffre',
  {
    identifiantAppelOffre: string;
  },
  Option.Type<ConsulterAppelOffreReadModel>
>;

export type ConsulterAppelOffreDependencies = {
  find: Find;
};

export const registerConsulterAppelOffreQuery = ({ find }: ConsulterAppelOffreDependencies) => {
  const handler: MessageHandler<ConsulterAppelOffreQuery> = async ({ identifiantAppelOffre }) => {
    const result = await find<AppelOffreEntity>(`appel-offre|${identifiantAppelOffre}`);

    return result;
  };

  mediator.register('AppelOffre.Query.ConsulterAppelOffre', handler);
};
