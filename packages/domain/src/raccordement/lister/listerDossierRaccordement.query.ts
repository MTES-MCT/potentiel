import { Find } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { ListeDossiersRaccordementReadModel } from './listeDossierRaccordement.readModel';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';

const LISTER_DOSSIER_RACCORDEMENT_QUERY = Symbol('LISTER_DOSSIER_RACCORDEMENT_QUERY');

type ListerDossiersRaccordementQuery = Message<
  typeof LISTER_DOSSIER_RACCORDEMENT_QUERY,
  {
    identifiantProjet: IdentifiantProjet;
  },
  ListeDossiersRaccordementReadModel
>;

type ListerDossiersRaccordementQueryDependencies = {
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

  mediator.register(LISTER_DOSSIER_RACCORDEMENT_QUERY, handler);
};

export const buildListerDossiersRaccordementQuery =
  getMessageBuilder<ListerDossiersRaccordementQuery>(LISTER_DOSSIER_RACCORDEMENT_QUERY);
