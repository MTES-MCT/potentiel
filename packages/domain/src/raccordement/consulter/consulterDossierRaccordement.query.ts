import { Find } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementReadModel } from './dossierRaccordement.readModel';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { Message, MessageHandler, mediator, newMessage } from 'mediateur';

export type ConsulterDossierRaccordementQuery = {
  identifiantProjet: IdentifiantProjet;
  référence: string;
};
const CONSULTER_DOSSIER_RACCORDEMENT_QUERY = Symbol('CONSULTER_DOSSIER_RACCORDEMENT_QUERY');

type ConsulterDossierRaccordementQuery = Message<
  typeof CONSULTER_DOSSIER_RACCORDEMENT_QUERY,
  {
    identifiantProjet: IdentifiantProjet;
    référence: string;
  },
  DossierRaccordementReadModel
>;

type ConsulterDossierRaccordementDependencies = {
  find: Find;
};

export const registerConsulterDossierRaccordementQuery = ({
  find,
}: ConsulterDossierRaccordementDependencies) => {
  const queryHandler: MessageHandler<ConsulterDossierRaccordementQuery> = async ({
    identifiantProjet,
    référence,
  }) => {
    const result = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${formatIdentifiantProjet(identifiantProjet)}#${référence}`,
    );
    if (isNone(result)) {
      throw new DossierRaccordementNonRéférencéError();
    }
    return result;
  };

  mediator.register(CONSULTER_DOSSIER_RACCORDEMENT_QUERY, queryHandler);
};

export const newConsulterDossierRaccordementQuery = newMessage<ConsulterDossierRaccordementQuery>(
  CONSULTER_DOSSIER_RACCORDEMENT_QUERY,
);
