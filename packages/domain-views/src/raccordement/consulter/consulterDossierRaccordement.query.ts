import { Find, NotFoundError } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { DossierRaccordementReadModel } from '../raccordement.readModel';
import {
  IdentifiantProjet,
  formatIdentifiantProjet,
} from '@potentiel/domain/dist/projet/identifiantProjet';

export type ConsulterDossierRaccordementQuery = Message<
  'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
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
      throw new NotFoundError(`Le dossier de raccordement n'est pas référencé`);
    }

    return result;
  };

  mediator.register('CONSULTER_DOSSIER_RACCORDEMENT_QUERY', queryHandler);
};

export const buildConsulterDossierRaccordementQuery =
  getMessageBuilder<ConsulterDossierRaccordementQuery>('CONSULTER_DOSSIER_RACCORDEMENT_QUERY');
