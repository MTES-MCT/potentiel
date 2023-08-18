import {
  IdentifiantAppelOffre,
  RawIdentifiantAppelOffre,
  convertirEnIdentifiantAppelOffre,
  estUnIdentifiantAppelOffre,
} from '@potentiel/domain';
import { Option, none } from '@potentiel/monads';
import { Message, MessageHandler, mediator } from 'mediateur';
import { AppelOffreReadModel, AppelOffreReadModelKey } from '../appelOffre.readModel';
import { Find } from '../../common.port';

export type ConsulterAppelOffreQuery = Message<
  'CONSULTER_APPEL_OFFRE_QUERY',
  {
    identifiantAppelOffre: RawIdentifiantAppelOffre | IdentifiantAppelOffre;
  },
  Option<AppelOffreReadModel>
>;

export type ConsulterAppelOffreDependencies = {
  find: Find;
};

export const registerConsulterAppelOffreQuery = ({ find }: ConsulterAppelOffreDependencies) => {
  const queryHandler: MessageHandler<ConsulterAppelOffreQuery> = async ({
    identifiantAppelOffre,
  }) => {
    const rawIdentifiantAppelOffre = estUnIdentifiantAppelOffre(identifiantAppelOffre)
      ? convertirEnIdentifiantAppelOffre(identifiantAppelOffre).formatter()
      : identifiantAppelOffre;

    const key: AppelOffreReadModelKey = `appel-offre|${rawIdentifiantAppelOffre}`;
    const result = await find<AppelOffreReadModel>(key);

    return result;
  };

  mediator.register('CONSULTER_APPEL_OFFRE_QUERY', queryHandler);
};

export const consulterAppelOffre = () => none;
