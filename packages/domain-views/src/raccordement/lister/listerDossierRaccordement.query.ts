import { IdentifiantProjet } from '@potentiel/domain';
import { isNone } from '@potentiel/monads';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { ListeDossiersRaccordementReadModel } from '../raccordement.readModel';
import { Find } from '../../domainViews.port';

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
      `liste-dossiers-raccordement#${identifiantProjet.formatter()}`,
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
