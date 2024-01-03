import { Message, MessageHandler, mediator } from 'mediateur';
import { isNone, Option } from '@potentiel/monads';
import { RégionNonTrouvéeError } from '../régionNonTrouvée.error';

export type ConsulterRégionDrealReadModel = {
  région: string;
};

export type ConsulterRégionDrealQuery = Message<
  'CONSULTER_RÉGION_DREAL_QUERY',
  {
    identifiantUtilisateur: string;
  },
  ConsulterRégionDrealReadModel
>;

export type RécupérerRégionDrealPort = (
  identifiantUtilisateur: string,
) => Promise<Option<{ région: string }>>;

export type ConsulterRégionDrealDependencies = {
  récupérerRégionDreal: RécupérerRégionDrealPort;
};

export const registerConsulterRégionDrealQuery = ({
  récupérerRégionDreal,
}: ConsulterRégionDrealDependencies) => {
  const handler: MessageHandler<ConsulterRégionDrealQuery> = async ({ identifiantUtilisateur }) => {
    const result = await récupérerRégionDreal(identifiantUtilisateur);

    if (isNone(result)) {
      throw new RégionNonTrouvéeError();
    }

    return result;
  };

  mediator.register('CONSULTER_RÉGION_DREAL_QUERY', handler);
};
