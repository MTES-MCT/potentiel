import { Find } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementReadModel } from './dossierRaccordement.readModel';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';

export const CONSULTER_DOSSIER_RACCORDEMENT_QUERY = Symbol('CONSULTER_DOSSIER_RACCORDEMENT_QUERY');

export type ConsulterDossierRaccordementQuery = Message<
  typeof CONSULTER_DOSSIER_RACCORDEMENT_QUERY,
  {
    identifiantProjet: IdentifiantProjet;
    référence: string;
  },
  DossierRaccordementReadModel
>;

export type ConsulterDossierRaccordementDependencies = {
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

export const buildConsulterDossierRaccordementQuery =
  getMessageBuilder<ConsulterDossierRaccordementQuery>(CONSULTER_DOSSIER_RACCORDEMENT_QUERY);
