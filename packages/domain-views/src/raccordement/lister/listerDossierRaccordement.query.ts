import { Find } from '@potentiel/core-domain';
import {
  IdentifiantProjet,
  formatIdentifiantProjet,
} from '@potentiel/domain/dist/projet/valueType/identifiantProjet';
import { isNone } from '@potentiel/monads';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { ListeDossiersRaccordementReadModel } from '../raccordement.readModel';

export type ListerDossiersRaccordementQuery = Message<
  'LISTER_DOSSIER_RACCORDEMENT_QUERY',
  {
    identifiantProjet: IdentifiantProjet;
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
      `liste-dossiers-raccordement#${formatIdentifiantProjet(identifiantProjet)}`,
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

export const buildListerDossiersRaccordementQuery =
  getMessageBuilder<ListerDossiersRaccordementQuery>('LISTER_DOSSIER_RACCORDEMENT_QUERY');
