import { Message, MessageHandler, mediator } from 'mediateur';
import { Find } from '@potentiel-libraries/projection';
import { AppelOffre, AppelOffreProjection } from '../appelOffre.projection';
import { isNone } from '@potentiel/monads';
import { AppelOffreInconnuErreur } from '../appelOffreInconnu.error';

export type ConsulterAppelOffreReadModel = AppelOffre;

export type ConsulterAppelOffreQuery = Message<
  'CONSULTER_APPEL_OFFRE_QUERY',
  {
    identifiantAppelOffre: string;
  },
  ConsulterAppelOffreReadModel
>;

export type ConsulterAppelOffreDependencies = {
  find: Find;
};

export const registerConsulterAppelOffreQuery = ({ find }: ConsulterAppelOffreDependencies) => {
  const handler: MessageHandler<ConsulterAppelOffreQuery> = async ({ identifiantAppelOffre }) => {
    const result = await find<AppelOffreProjection>(`appel-offre|${identifiantAppelOffre}`);

    if (isNone(result)) {
      throw new AppelOffreInconnuErreur();
    }

    return result;
  };

  mediator.register('CONSULTER_APPEL_OFFRE_QUERY', handler);
};
