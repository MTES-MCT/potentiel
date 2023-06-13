import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '@potentiel/domain';
import { isNone } from '@potentiel/monads';
import { Message, MessageHandler, mediator } from 'mediateur';
import { ListeDossiersRaccordementReadModel } from '../raccordement.readModel';
import { Find } from '../../common.port';

export type ListerDossiersRaccordementQuery = Message<
  'LISTER_DOSSIER_RACCORDEMENT_QUERY',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  ListeDossiersRaccordementReadModel
>;

export type ListerDossiersRaccordementQueryDependencies = {
  find: Find;
};

export const registerListerDossiersRaccordementQuery = ({
  find,
}: ListerDossiersRaccordementQueryDependencies) => {
  const handler: MessageHandler<ListerDossiersRaccordementQuery> = async ({
    identifiantProjet,
  }) => {
    const result = await find<ListeDossiersRaccordementReadModel>(
      `liste-dossiers-raccordement#${
        estUnIdentifiantProjet(identifiantProjet)
          ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
          : identifiantProjet
      }`,
    );

    if (isNone(result)) {
      return {
        type: 'liste-dossiers-raccordement',
        références: [],
      };
    }

    return result;
  };

  mediator.register('LISTER_DOSSIER_RACCORDEMENT_QUERY', handler);
};
